import { Calendar } from "lucide-react"
import { EventsTable } from "./events-table"
import SectionCardsClient from "./section-cards-client"
import { fetchEvents } from "@/app/actions/fetchEvents"
import getSectionCardsData from "./section-cards-server"

export default async function Content() {
  const events = await fetchEvents()
  const cardsData = await getSectionCardsData()

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h1>
        <SectionCardsClient cards={cardsData} />
      </div>

      <div className="bg-white dark:bg-[#0F0F12] rounded-lg p-6 border border-gray-200 dark:border-[#1F1F23]">
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-5 h-5 text-gray-900 dark:text-white" />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Upcoming Events</h2>
        </div>
        <EventsTable data={events} />
      </div>
    </div>
  )
}
