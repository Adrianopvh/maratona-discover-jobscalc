const express = require('express');
const routes = express.Router();

const views = __dirname + '/views/'

const profile = {
    name: "Adriano Rodrigues",
    avatar: "https://github.com/Adrianopvh.png",
    "monthly-budget": 7000,
    "days-per-week": 5,
    "hours-per-day": 5,
    "vacation-per-year": 4,
    "value-hour": 75
}

const job = {
    data: [
        {
            id: 1,
            name: "Pizzaria Guloso",
            "daily-hours": 2,
            "total-hours": 1,
            created_at: Date.now(),
        },
        {
            id: 2,
            name: "OneTwo Project",
            "daily-hours": 3,
            "total-hours": 36,
            created_at: Date.now(),
        }
    ],
    controllers: {
        index(req, res) {
            const updatedJobs = job.data.map((job) => {
                const remaining = job.services.remainingDays(job)
                const status = remaining <= 0 ? 'done' : 'progress'

                return {
                    ...job,
                    remaining,
                    status,
                    budget: profile["value-hour"] * job["total-hours"]
                }
            })

            return res.render(views + "index", { jobs: updatedJobs })
        },
        create(req, res) {
            return res.render(views + "job")
        },
        save(req, res) {
            const lastId = job.data[job.data.length - 1]?.id || 1;

            jobs.push({
                id: lastId + 1,
                name: req.body.name,
                "daily-hours": req.body["daily-hours"],
                "total-hours": req.body["total-hours"],
                created_at: Date.now()
            });
            return res.redirect('/')
        }
    },
    services: {
        remainingDays(job) {
            const remainingDays = (job["total-hours"] / job["daily-hours"]).toFixed();

            const createdDate = new Date(job.created_at)
            const dueDay = createdDate.getDate() + Number(remainingDays)
            const dueDateInMs = createdDate.setDate(dueDay)

            const timeDiffInMs = dueDateInMs - Date.now()

            const dayInMs = 1000 * 60 * 60 * 24
            const dayDIff = Math.floor(timeDiffInMs / dayInMs)

            return dayDIff
        }
    }
}

routes.get('/', job.controllers.index);

routes.get('/job', job.controllers.create);
routes.post('/job', job.controllers.save);
routes.get('/job/edit', (req, res) => res.render(views + "job-edit"));
routes.get('/profile', (req, res) => res.render(views + "profile", { profile }));

module.exports = routes;