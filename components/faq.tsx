import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

const faqs = [
  {
    question: "What makes Nano Banana different from other AI image editors?",
    answer:
      "Nano Banana uses an advanced AI model that excels at character consistency and scene preservation. Unlike other tools, our model maintains visual coherence across multiple edits and delivers professional-quality results that surpass competitors like Flux Kontext.",
  },
  {
    question: "How does the image upload feature work?",
    answer:
      "Simply drag and drop your image or click to upload. We support all common image formats (JPG, PNG, WebP) up to 50MB. Once uploaded, you can use natural language prompts to describe the edits you want to make.",
  },
  {
    question: "What kind of edits can I make with text prompts?",
    answer:
      "You can perform a wide range of edits including changing backgrounds, adjusting lighting, modifying objects, applying artistic styles, enhancing portraits, and much more. Our natural language processing understands complex instructions and delivers precise results.",
  },
  {
    question: "How long does it take to generate edited images?",
    answer:
      "Most edits are completed in just a few seconds. Our optimized model is designed for speed without compromising quality, making it perfect for professional workflows where time matters.",
  },
  {
    question: "Can I use Nano Banana for commercial projects?",
    answer:
      "Yes! All images generated with Nano Banana can be used for commercial purposes. We offer flexible licensing options to suit different business needs.",
  },
  {
    question: "Is there a limit to how many images I can edit?",
    answer:
      "Our free tier includes a generous number of edits per month. For unlimited access and advanced features, check out our premium plans designed for professionals and teams.",
  },
  {
    question: "What image formats are supported?",
    answer:
      "We support all common image formats including JPG, PNG, WebP, and HEIC. Output images can be downloaded in your preferred format with customizable quality settings.",
  },
  {
    question: "Do you offer an API for developers?",
    answer:
      "Yes! We provide a comprehensive API that allows developers to integrate Nano Banana's AI editing capabilities into their own applications. Documentation and SDKs are available for popular programming languages.",
  },
]

export function FAQ() {
  return (
    <section id="faq" className="py-20 bg-muted/30">
      <div className="container">
        <div className="mx-auto max-w-2xl text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-balance">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-balance leading-relaxed">
            Everything you need to know about Nano Banana's AI image editing platform.
          </p>
        </div>

        <div className="mx-auto max-w-3xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  )
}
