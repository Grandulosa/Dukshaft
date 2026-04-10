import { Metadata } from "next"
import { Shield, Smartphone, Globe, Code2, Rocket, Paintbrush, Database, Sparkles } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"

export const metadata: Metadata = {
  title: "About Dukshaft | Performance-Driven Software Development",
  description: "Dukshaft LLC is a New York–based software independent studio specializing in creating technically robust and intuitively designed applications across web, mobile, and cloud platforms.",
}

const services = [
  {
    icon: Globe,
    title: "Custom Website Development",
    description: "Scalable, responsive websites designed for performance, clarity, and user engagement.",
  },
  {
    icon: Smartphone,
    title: "Mobile App Development",
    description: "Native and cross-platform applications built for speed, reliability, and long-term maintainability.",
  },
  {
    icon: Paintbrush,
    title: "UI/UX Design",
    description: "Clean, modern interfaces focused on usability and visual precision.",
  },
  {
    icon: Database,
    title: "Backend Systems & APIs",
    description: "Secure, scalable infrastructure powering applications and data systems.",
  },
]

const features = [
  "Structured architecture — scalable from day one",
  "Performance optimization — fast, efficient, and responsive",
  "User-centered design — intuitive and frictionless",
  "Clean implementation — maintainable and extensible code",
]

export default function AboutPage() {
  return (
    <div className="relative isolate pt-24 pb-32 overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-blue-500/5 via-transparent to-transparent opacity-50" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-purple-500/5 via-transparent to-transparent opacity-50" />

      <div className="container px-4 md:px-6">
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center space-y-4 mb-24">
          <Badge variant="outline" className="px-4 py-1 border-primary/20 bg-primary/5 text-primary backdrop-blur-sm">
            <Sparkles className="w-3 h-3 mr-2" />
            Learn about Dukshaft
          </Badge>
          <h1 className="text-4xl font-extrabold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
            Building the next generation of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
              Digital Excellence
            </span>
          </h1>
          <p className="max-w-[800px] text-muted-foreground md:text-xl/relaxed lg:text-2xl/relaxed font-light">
            Dukshaft LLC is an independent software development company focused on building high-quality digital products for modern businesses and consumers.
          </p>
        </div>

        <div className="grid gap-16 lg:gap-24">
          {/* Company Overview */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Precision. Performance. Usability.</h2>
              <div className="space-y-4 text-muted-foreground text-lg font-light leading-relaxed">
                <p>
                  Founded with a commitment to technical excellence, Dukshaft specializes in creating applications and systems that are both technically robust and intuitively designed.
                </p>
                <p>
                  Operating as a New York–based limited liability company, we develop solutions across web, mobile, and cloud platforms, delivering products that integrate seamlessly into today’s digital ecosystems.
                </p>
              </div>
            </div>
            <div className="relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 opacity-20 blur group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-background border rounded-2xl p-8 shadow-2xl overflow-hidden min-h-[300px] flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4 opacity-50 select-none pointer-events-none transform -rotate-12 scale-125">
                   {[...Array(20)].map((_, i) => (
                     <div key={i} className="h-4 bg-muted rounded w-32" />
                   ))}
                </div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <Shield className="w-24 h-24 text-primary opacity-20" />
                </div>
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1">HQ</div>
                  <div className="text-lg font-semibold">New York, USA</div>
                </div>
              </div>
            </div>
          </section>

          <Separator className="opacity-50" />

          {/* What We Do */}
          <section className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">What We Do</h2>
              <p className="text-muted-foreground text-lg font-light">
                We provide end-to-end software development services, handling everything from initial design to long-term lifecycle management.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <div key={service.title} className="group p-6 rounded-2xl border bg-background/50 backdrop-blur-sm hover:border-primary/50 transition-all hover:shadow-xl">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 text-primary group-hover:scale-110 transition-transform">
                    <service.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{service.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Our Approach */}
          <section className="relative rounded-3xl border bg-muted/30 p-8 md:p-12 overflow-hidden">
             <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
               <Code2 className="w-64 h-64" />
             </div>
             <div className="relative z-10 max-w-4xl space-y-8">
                <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Our Approach</h2>
                <p className="text-xl text-muted-foreground font-light">
                  Dukshaft operates with a systems-first philosophy. Rather than treating development as isolated tasks, we build cohesive systems designed to evolve alongside your business.
                </p>
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((feature) => (
                    <div key={feature} className="flex items-center space-x-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                        <Rocket className="w-4 h-4 text-primary" />
                      </div>
                      <span className="text-base font-medium">{feature}</span>
                    </div>
                  ))}
                </div>
             </div>
          </section>

          {/* Products - Pomonote */}
          <section className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1 relative group">
              <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-orange-500 to-red-600 opacity-20 blur group-hover:opacity-30 transition duration-1000"></div>
              <div className="relative bg-[#020202] border rounded-2xl p-12 shadow-2xl aspect-square flex flex-col items-center justify-center text-center overflow-hidden">
                  <div className="w-32 h-32 rounded-3xl bg-orange-600 flex items-center justify-center mb-6 shadow-2xl">
                    <span className="text-5xl font-bold text-white tracking-widest">P</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-2">Pomonote</h3>
                  <p className="text-muted-foreground text-sm uppercase tracking-widest px-8">Native Productivity Suite</p>
                  
                  {/* Decorative Elements for Pomonote UI */}
                  <div className="mt-8 flex gap-2">
                    <div className="w-12 h-1 bg-orange-600/50 rounded" />
                    <div className="w-8 h-1 bg-orange-600/20 rounded" />
                    <div className="w-16 h-1 bg-orange-600/30 rounded" />
                  </div>
              </div>
            </div>
            <div className="order-1 md:order-2 space-y-6">
              <Badge className="bg-orange-600/10 text-orange-500 border-orange-500/20 hover:bg-orange-600/20">Featured Product</Badge>
              <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pomonote</h2>
              <div className="space-y-4 text-muted-foreground text-lg font-light leading-relaxed">
                <p>
                  Pomonote reflects Dukshaft’s core philosophy: tools should be simple to use, yet powerful in capability.
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center text-base"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-3" /> Pomodoro timer functionality</li>
                  <li className="flex items-center text-base"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-3" /> Integrated note-taking system</li>
                  <li className="flex items-center text-base"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-3" /> Performance tracking and statistics</li>
                  <li className="flex items-center text-base"><div className="w-1.5 h-1.5 rounded-full bg-orange-500 mr-3" /> Guided breathing & session tracking</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Mission & Contact Footer */}
          <section className="text-center py-24 px-6 rounded-3xl bg-primary text-primary-foreground relative overflow-hidden">
             <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.3)_100%)] opacity-50" />
             <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                <h2 className="text-3xl font-bold sm:text-5xl">Our Mission</h2>
                <p className="text-xl md:text-2xl opacity-90 font-light leading-relaxed font-serif italic">
                  &ldquo;To design and build software that is reliable in performance, refined in experience, and scalable in structure.&rdquo;
                </p>
                <div className="pt-12 text-sm opacity-80 space-y-2">
                  <div className="font-bold text-lg mb-4">Dukshaft LLC</div>
                  <p>New York, USA</p>
                  <p>contact@dukshaft.com</p>
                  <p>dukshaft.com</p>
                </div>
             </div>
          </section>
        </div>
      </div>
    </div>
  )
}
