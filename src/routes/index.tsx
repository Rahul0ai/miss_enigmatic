import { createFileRoute } from "@tanstack/react-router";
import { AdventureMap } from "@/components/birthday/AdventureMap";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Happy Birthday, Captain Rupa — A One Piece Adventure" },
      { name: "description", content: "An interactive pirate-themed birthday voyage inspired by One Piece — chapters of memories, treasure, and love." },
      { property: "og:title", content: "Happy Birthday, Captain Rupa — A One Piece Adventure" },
      { property: "og:description", content: "Set sail through five chapters of memory, laughter, and love." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  return <AdventureMap />;
}
