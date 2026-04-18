"use client"

import { useState } from "react"
import { CareersListings, type DbJobListing } from "./careers-listings"
import { CareersCta } from "./careers-cta"
import { ApplyModal, type JobOption } from "./apply-modal"

interface CareersContainerProps {
  jobs: DbJobListing[]
}

export function CareersContainer({ jobs }: CareersContainerProps) {
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedJob, setSelectedJob] = useState<{ id: string; title: string } | null>(null)

  const openForJob = (jobId: string, jobTitle: string) => {
    setSelectedJob({ id: jobId, title: jobTitle })
    setModalOpen(true)
  }

  const openGeneral = () => {
    setSelectedJob(null)
    setModalOpen(true)
  }

  const jobOptions: JobOption[] = jobs.map((j) => ({ id: j.id, title: j.title }))

  return (
    <>
      <CareersListings jobs={jobs} onApply={openForJob} />
      <CareersCta onGeneralApply={openGeneral} hasJobs={jobs.length > 0} />
      <ApplyModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        jobs={jobOptions}
        defaultJobId={selectedJob?.id}
        defaultJobTitle={selectedJob?.title}
      />
    </>
  )
}
