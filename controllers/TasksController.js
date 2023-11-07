const { Sequelize } = require("sequelize");
const Task = require("../models/Task");
const moment = require("moment");
const { Op } = require("sequelize");
const sequelize = require("../database/databaseConnection");
const ListStatus = require("../models/ListStatus");
const Status = require("../models/Status");
const Comment = require("../models/Comment");
module.exports = {
  async createTask(req, res) {
    try {
      const userRole = req.user.role.machine_name;
      if (userRole !== "admin") {
        return res
          .status(401)
          .send({ error: "No estas autorizado para crear tasks" });
      }
      const { title, description, expiration_date, user_execute_id } = req.body;

      const newTask = await Task.create({
        title: title,
        description: description,
        user_execute_id: user_execute_id,
        user_creator_id: req.user.id,
        expiration_date: moment(expiration_date, "YYYY/MM/DD").toDate(),
      });

      const newStatus = await ListStatus.create({
        task_id: newTask.id,
        status_id: 1,
      });

      return res.status(201).send(newTask);
    } catch (error) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
  },

  async getAllTasks(req, res) {
    try {
      const userRole = req.user.role.machine_name;
      let tasks;
      if (userRole !== "admin") {
        tasks = await sequelize.query(
          `SELECT tasks.*, statuses.name AS latest_status, statuses.machine_name AS status_machine_name
          FROM tasks
          INNER JOIN (
              SELECT task_id, MAX(list_statuses."createdAt") AS latest_date
              FROM list_statuses 
              GROUP BY task_id
          ) latest_statuses
          ON tasks.id = latest_statuses.task_id
          INNER JOIN list_statuses
          ON latest_statuses.task_id = list_statuses.task_id 
          AND latest_statuses.latest_date = list_statuses."createdAt" 
          INNER JOIN statuses
          ON list_statuses.status_id = statuses.id
          WHERE tasks.user_execute_id = :user_execute_id 
          ORDER BY tasks.id DESC`,
          {
            replacements: { user_execute_id: req.user.id },
          }
        );
      } else {
        tasks = await sequelize.query(
          `SELECT tasks.*, statuses.name AS latest_status, statuses.machine_name AS status_machine_name
          FROM tasks
          INNER JOIN (
              SELECT task_id, MAX(list_statuses."createdAt") AS latest_date
              FROM list_statuses 
              GROUP BY task_id
          ) latest_statuses
          ON tasks.id = latest_statuses.task_id
          INNER JOIN list_statuses
          ON latest_statuses.task_id = list_statuses.task_id 
          AND latest_statuses.latest_date = list_statuses."createdAt" 
          INNER JOIN statuses
          ON list_statuses.status_id = statuses.id
          WHERE tasks.user_creator_id = :user_creator_id 
          ORDER BY tasks.id DESC`,
          {
            replacements: { user_creator_id: req.user.id },
          }
        );
      }
      return res.status(200).send(tasks[0]);
    } catch (error) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
  },

  async getTaskById(req, res) {
    try {
      const { taskId } = req.params;

      tasks = await sequelize.query(
        `SELECT tasks.*, statuses.name AS latest_status, statuses.id AS status_id, statuses.machine_name AS status_machine_name
        FROM tasks
        INNER JOIN (
            SELECT task_id
            FROM list_statuses
            GROUP BY task_id
        ) latest_statuses
        ON tasks.id = latest_statuses.task_id
        INNER JOIN list_statuses
        ON latest_statuses.task_id = list_statuses.task_id
        INNER JOIN statuses
        ON list_statuses.status_id = statuses.id
        WHERE (tasks.id = :task_id) 
        AND (tasks.user_creator_id = :user_creator_id 
        OR tasks.user_execute_id = :user_execute_id)
        ORDER BY list_statuses."createdAt"  DESC 
        LIMIT 1`,
        {
          replacements: {
            user_creator_id: req.user.id,
            user_execute_id: req.user.id,
            task_id: taskId,
          },
        }
      );

      if (tasks[0].length == 0) {
        return res.status(404).send({ error: "Task no encontrado" });
      }

      return res.status(200).send(tasks[0][0]);
    } catch (error) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
  },

  async updateTask(req, res) {
    try {
      const { taskId } = req.params;

      const {
        title,
        description,
        expiration_date,
        user_execute_id,
        status_id,
        comment,
      } = req.body;

      //verificar si la tarea existe
      const task = await Task.findByPk(taskId);

      if (!task) {
        return res.status(404).send({ error: "Tasko no encontrado" });
      }

      // buscar el ultimo estado de la tareas y verificar si le pertenece al usuario
      const latestStatus = await sequelize.query(
        `SELECT tasks.*, statuses.machine_name AS status_machine_name
        FROM tasks
        INNER JOIN (
            SELECT task_id, MAX(list_statuses."createdAt") AS latest_date
            FROM list_statuses 
            GROUP BY task_id
        ) latest_statuses
        ON tasks.id = latest_statuses.task_id
        INNER JOIN list_statuses
        ON latest_statuses.task_id = list_statuses.task_id 
        AND latest_statuses.latest_date = list_statuses."createdAt" 
        INNER JOIN statuses
        ON list_statuses.status_id = statuses.id
        WHERE tasks.id = :task_id AND (tasks.user_creator_id = :user_creator_id 
          OR tasks.user_execute_id = :user_execute_id)
        ORDER BY tasks.id`,
        {
          replacements: {
            user_creator_id: req.user.id,
            user_execute_id: req.user.id,
            task_id: taskId,
          },
        }
      );
      //verificamos si se encontro una tarea con el id del user creator o execute
      if (latestStatus[0].length == 0) {
        return res
          .status(404)
          .send({ error: "Task encontrado no le pertenece" });
      }
      const status = latestStatus[0][0].status;
      const userRole = req.user.role.machine_name;

      // comporbar si es admin y si el estado es distinto a asignado
      if (userRole == "admin" && status != "asignado") {
        return res.status(404).send({
          error: "No puede actualizar una tarea en un estado " + status,
        });
      }

      if (userRole == "admin" && status == "asignado") {
        // Actualiza los campos del task
        task.title = title;
        task.description = description;
        task.user_execute_id = user_execute_id;
        task.expiration_date = expiration_date;

        await task.save();
      }
      // comprobar si la tarea esta vencida
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = String(currentDate.getMonth() + 1).padStart(2, "0");
      const day = String(currentDate.getDate()).padStart(2, "0");

      const currentFormattedDate = `${year}-${month}-${day}`;

      //Validacion para agregar comentario si esta vencido
      if (currentFormattedDate > task.expiration_date) {
        if (comment) {
          const createdComment = await Comment.create({
            comment: comment,
            task_id: taskId,
          });

          return res.status(201).send({
            id: createdComment.id,
            task_id: taskId,
            msg: "Agregado con éxito el comentario",
          });
        } else {
          return res
            .status(400)
            .send({ error: "El comentario no puede estar vacio" });
        }
      }
      //verificar si ya la tarea esta finalizada asi no romper el flujo
      if (status == "finalizado-exito" || status == "finalizado-error") {
        return res.status(404).send({
          error: "Estas tareas estan finalizadas no pueden actualizarse",
        });
      }
      //comprobar que el usuario rol execute no pueda actualizar a Asignado
      if (status_id == 1 && userRole == "execute") {
        return res.status(401).send({
          error: "No tiene permiso para asignar el estado Asignado",
        });
      }
      // se verifica que no este vacio y se agrega el status
      if (status_id !== "") {
        const newStatus = await ListStatus.create({
          task_id: taskId,
          status_id: status_id,
        });
      }

      return res.status(200).send({msg:'Tarea actualizada con exito', task});
    } catch (error) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
  },

  async deleteTask(req, res) {
    try {
      const userRole = req.user.role.machine_name;
      if (userRole !== "admin") {
        return res
          .status(401)
          .send({ error: "No estas autorizado para eliminar tasks" });
      }
      const { taskId } = req.params;

      const task = await Task.findByPk(taskId);

      if (!task) {
        return res.status(404).send({ error: "Task no encontrado" });
      }

      // buscar el ultimo estado de la tareas y verificar si le pertenece al usuario
      const latestStatus = await sequelize.query(
        `SELECT tasks.*, statuses.machine_name AS status_machine_name
        FROM tasks
        INNER JOIN (
            SELECT task_id, MAX(list_statuses."createdAt") AS latest_date
            FROM list_statuses 
            GROUP BY task_id
        ) latest_statuses
        ON tasks.id = latest_statuses.task_id
        INNER JOIN list_statuses
        ON latest_statuses.task_id = list_statuses.task_id 
        AND latest_statuses.latest_date = list_statuses."createdAt" 
        INNER JOIN statuses
        ON list_statuses.status_id = statuses.id
        WHERE tasks.id = :task_id AND (tasks.user_creator_id = :user_creator_id 
          OR tasks.user_execute_id = :user_execute_id)
        ORDER BY tasks.id`,
        {
          replacements: {
            user_creator_id: req.user.id,
            user_execute_id: req.user.id,
            task_id: taskId,
          },
        }
      );
      //verificamos si se encontro una tarea con el id del user creator o execute
      if (latestStatus[0].length == 0) {
        return res
          .status(404)
          .send({ error: "Task encontrado no le pertenece" });
      }

      await task.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
  },

  async statusTask(req, res) {
    try {
      const statuses = await Status.findAll();

      return res.status(200).send(statuses);
    } catch (error) {
      return res.status(500).send({ error: "Error interno del servidor" });
    }
  },
};
