import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const examples = [
  {
    title: "Portrait Enhancement",
    description: "Transform portraits with natural lighting and professional quality",
    image: "/professional-portrait-with-natural-lighting.jpg",
    category: "Portrait",
  },
  {
    title: "Scene Transformation",
    description: "Change environments while maintaining character consistency",
    image: "/character-in-futuristic-city-scene.jpg",
    category: "Scene",
  },
  {
    title: "Style Transfer",
    description: "Apply artistic styles while preserving original composition",
    image: "/artistic-style-transfer-painting.jpg",
    category: "Style",
  },
  {
    title: "Object Editing",
    description: "Add or remove objects with seamless integration",
    image: "/seamless-object-editing-in-photo.jpg",
    category: "Edit",
  },
  {
    title: "Color Grading",
    description: "Professional color correction and mood enhancement",
    image: "/cinematic-color-grading.png",
    category: "Color",
  },
  {
    title: "Character Consistency",
    description: "Maintain character features across multiple edits",
    image: "/consistent-character-across-scenes.jpg",
    category: "Character",
  },
]

export function Examples() {
  return (
    <section id="examples" className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Showcase Gallery</h2>
          <p className="text-muted-foreground text-balance leading-relaxed">
            Explore stunning examples of what's possible with Nano Banana's AI-powered image editing.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {examples.map((example, index) => (
            <Card key={index} className="overflow-hidden group hover:shadow-xl transition-shadow">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={example.image || "/placeholder.svg"}
                  alt={example.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
                <Badge className="absolute top-3 right-3 bg-primary/90 text-primary-foreground">
                  {example.category}
                </Badge>
              </div>
              <div className="p-5">
                <h3 className="font-semibold mb-2">{example.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{example.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
