import AreaSchema, {IAreaSchema} from "../schemas/AreaSchema";

export async function updateSchedule(areaId: number) {
    try {
        const area = await AreaSchema.findById(areaId);
        if (area) {
            createOrUpdateJob(area);
            console.log(`Updated schedule for area ${areaId}`);
        }
    } catch (error) {
        console.error(`Error updating schedule for area ${areaId}`, error);
    }
}

/* GESTIONE POLLING */
import schedule from "node-schedule";
import axios from "axios";

const scheduledJobs: { [areaId: string]: schedule.Job } = {};

export async function generateSchedule() {
    console.log("generateSchedule()");
    const areas: IAreaSchema[] = await AreaSchema.find({}).exec();

    for (const area of areas) {
        console.log(`Creating job for area ${area.id}`);
        await createOrUpdateJob(area);
    }
}

async function createOrUpdateJob(area: IAreaSchema) {
    const existingJob = scheduledJobs[area.id.toString()];

    if (existingJob) {
        console.log(`Cancelling existing job for area ${area.id}`);
        existingJob.cancel();
    }

    scheduledJobs[area.id.toString()] = schedule.scheduleJob(
        area.id.toString(),
        `*/${area.polling} * * * * *`,
        async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/api/segnale/area/${area.id}/token`
                );

                if (response.status === 200) {
                    console.log("Response obtained successfully");
                }
            } catch (error) {
            }
        }
    );
}

AreaSchema.watch([], { fullDocument: 'updateLookup' }).on("change", async (change) => {
    console.log("Detected change in area component");
    const areaId = change.documentKey._id;

    if (change.operationType === "insert" || change.operationType === "update") {
        const area = await AreaSchema.findById(areaId);
        if (area) {
            createOrUpdateJob(area);
        }
    } else if (change.operationType === "delete") {
        const jobId = areaId.toString();
        if (scheduledJobs[jobId]) {
            console.log(`Cancelling job for deleted area ${areaId}`);
            scheduledJobs[jobId].cancel();
            delete scheduledJobs[jobId];
        }
    }
});