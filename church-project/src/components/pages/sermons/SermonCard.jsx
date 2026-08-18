// src/components/pages/sermons/SermonCard.jsx

import {Card} from "@/components/shared/Card";

export default function SermonCard({ sermon }) {
  return (
    <Card className="overflow-hidden">
      <div className="aspect-video overflow-hidden rounded-t-3xl">
        <iframe
          src={sermon.youtubeUrl}
          title={sermon.title}
          className="w-full h-full"
          loading="lazy"
          allowFullScreen
        />
      </div>

      <div className="p-6">
        <h3 className="text-xl font-semibold text-slate-900">
          {sermon.title}
        </h3>

        <p className="mt-3 text-sm text-slate-600">
          {sermon.speaker}
        </p>

        <p className="mt-1 text-sm text-slate-500">
          {sermon.date}
        </p>
      </div>
    </Card>
  );
}