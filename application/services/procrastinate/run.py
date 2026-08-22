import logging

from procrastinate.jobs import Status as JobStatus

from .application import procrastinate


logging.basicConfig(level=logging.INFO)

logger = logging.getLogger(__name__)


procrastinate.open()
jobs = procrastinate.job_manager.list_jobs(status='doing')
for job in jobs:
    logger.warning(f'Deleting stalled job {job.task_name}(ID: {job.id})')
    procrastinate.job_manager.finish_job_by_id(job.id, status=JobStatus.FAILED, delete_job=True)
procrastinate.run_worker(concurrency=6, delete_jobs='successful')
