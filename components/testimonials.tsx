import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Star } from "lucide-react"

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Digital Artist",
    avatar: "/professional-woman-portrait.png",
    content:
      "copybanana has completely transformed my workflow. The character consistency is unmatched, and the results are always stunning.",
    rating: 5,
  },
  {
    name: "Marcus Rodriguez",
    role: "Content Creator",
    avatar: "/professional-man-portrait.png",
    content:
      "I've tried many AI image editors, but nothing comes close to the quality and speed of copybanana. It's a game-changer.",
    rating: 5,
  },
  {
    name: "Emily Watson",
    role: "Photographer",
    avatar: "/photographer-portrait.png",
    content:
      "The scene preservation feature is incredible. I can make complex edits while maintaining the integrity of my original photos.",
    rating: 5,
  },
  {
    name: "David Kim",
    role: "Marketing Director",
    avatar: "/business-professional-portrait.png",
    content:
      "Our team uses copybanana daily for campaign assets. The natural language interface makes it accessible to everyone.",
    rating: 5,
  },
  {
    name: "Lisa Anderson",
    role: "Graphic Designer",
    avatar: "/creative-professional-portrait.png",
    content: "The quality of edits is consistently professional. It's like having a senior retoucher on demand.",
    rating: 5,
  },
  {
    name: "James Park",
    role: "Social Media Manager",
    avatar: "/young-professional-portrait.png",
    content:
      "Fast, reliable, and produces amazing results. copybanana has become an essential tool in my creative toolkit.",
    rating: 5,
  },
]

export function Testimonials() {
  return (
    <section className="py-20">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Loved by Creators</h2>
          <p className="text-muted-foreground text-balance leading-relaxed">
            Join thousands of professionals who trust copybanana for their image editing needs.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
              <div className="flex gap-1 mb-4">
                {Array.from({ length: testimonial.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-primary text-primary" />
                ))}
              </div>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">"{testimonial.content}"</p>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={testimonial.avatar || "/placeholder.svg"} alt={testimonial.name} />
                  <AvatarFallback>
                    {testimonial.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-sm">{testimonial.name}</p>
                  <p className="text-xs text-muted-foreground">{testimonial.role}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
