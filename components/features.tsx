import { Card } from "@/components/ui/card"
import { Sparkles, ImageIcon, Zap, Shield } from "lucide-react"

const features = [
  {
    icon: Sparkles,
    title: "Advanced AI Model",
    description:
      "Powered by cutting-edge AI technology that understands context and preserves character consistency across edits.",
  },
  {
    icon: ImageIcon,
    title: "Scene Preservation",
    description:
      "Maintain the integrity of your original image while making precise edits with natural language commands.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    description: "Get results in seconds. Our optimized model delivers professional-quality edits without the wait.",
  },
  {
    icon: Shield,
    title: "Consistent Results",
    description: "Reliable character editing that maintains visual coherence across multiple transformations.",
  },
]

export function Features() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Why Choose Nano Banana?</h2>
          <p className="text-muted-foreground text-balance leading-relaxed">
            Experience the next generation of AI-powered image editing with features designed for professionals and
            creators.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
