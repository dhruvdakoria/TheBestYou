import Hero from "@/components/hero";
import Navbar from "@/components/navbar";
import PricingCard from "@/components/pricing-card";
import Footer from "@/components/footer";
import { createClient } from "../../supabase/server";
import {
  ArrowUpRight,
  Dumbbell,
  Utensils,
  LineChart,
  Brain,
  Sparkles,
  BarChart3,
  Smartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function Home() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: plans, error } = await supabase.functions.invoke(
    "supabase-functions-get-plans",
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <Hero />

      {/* Features Section */}
      <section className="py-24 bg-card" id="features">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Transform Your Life With TheBestYou
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our comprehensive platform helps you track, analyze, and improve
              every aspect of your self-improvement journey.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                icon: <Dumbbell className="w-8 h-8 text-primary" />,
                title: "Strength Training",
                description:
                  "Track workouts with customizable templates, exercise search, and weight progression graphs to visualize your gains over time.",
              },
              {
                icon: <Utensils className="w-8 h-8 text-primary" />,
                title: "AI Nutrition Tracking",
                description:
                  "Log meals with our AI image recognition, calculate macros automatically, and receive personalized nutrition recommendations.",
              },
              {
                icon: <LineChart className="w-8 h-8 text-primary" />,
                title: "Habit Building",
                description:
                  "Create and maintain positive habits with our streak counter and monthly consistency visualizations to stay motivated.",
              },
              {
                icon: <Brain className="w-8 h-8 text-primary" />,
                title: "AI-Powered Insights",
                description:
                  "Receive personalized recommendations and insights based on your progress data to optimize your self-improvement journey.",
              },
              {
                icon: <Sparkles className="w-8 h-8 text-primary" />,
                title: "Premium Dark UI",
                description:
                  "Enjoy our sleek, dark-themed interface designed for comfort during both day and night usage with high contrast visuals.",
              },
              {
                icon: <BarChart3 className="w-8 h-8 text-primary" />,
                title: "Progress Dashboard",
                description:
                  "View all your metrics in one place with our comprehensive dashboard featuring interactive charts and visualizations.",
              },
            ].map((feature, index) => (
              <div
                key={index}
                className="p-8 bg-background rounded-xl border border-border shadow-sm hover:shadow-md transition-all hover:border-primary/50"
              >
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* App Preview Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Your Complete Self-Improvement Dashboard
              </h2>
              <p className="text-muted-foreground mb-8">
                Our intuitive dashboard gives you a comprehensive view of your
                fitness, nutrition, and habit data all in one place. Track your
                progress, identify patterns, and make data-driven decisions to
                improve your life.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Interactive charts and visualizations",
                  "Daily, weekly, and monthly progress tracking",
                  "Personalized goal setting and monitoring",
                  "AI-powered recommendations based on your data",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-primary/20 p-1">
                      <ArrowUpRight className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90"
              >
                <Link href="/sign-up">Start Tracking Now</Link>
              </Button>
            </div>

            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <div className="relative rounded-xl overflow-hidden border border-border shadow-xl">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 mix-blend-overlay"></div>
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80"
                  alt="TheBestYou Dashboard"
                  className="w-full h-auto rounded-xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2">10K+</div>
              <div className="text-primary-foreground/80">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">1M+</div>
              <div className="text-primary-foreground/80">Workouts Tracked</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">5M+</div>
              <div className="text-primary-foreground/80">Meals Logged</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">98%</div>
              <div className="text-primary-foreground/80">
                User Satisfaction
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mobile App Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl font-bold mb-6 text-foreground">
                Take Your Progress Anywhere
              </h2>
              <p className="text-muted-foreground mb-8">
                Access TheBestYou on any device. Our responsive design ensures
                you can track your progress whether you're at home, at the gym,
                or on the go.
              </p>

              <ul className="space-y-4 mb-8">
                {[
                  "Seamless sync across all your devices",
                  "Offline tracking capabilities",
                  "Quick entry options for workouts and meals",
                  "Real-time progress updates",
                ].map((item, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="mt-1 rounded-full bg-primary/20 p-1">
                      <Smartphone className="w-4 h-4 text-primary" />
                    </div>
                    <span className="text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="lg:w-1/2 mt-8 lg:mt-0">
              <div className="relative max-w-xs mx-auto">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-accent/20 rounded-[3rem] blur-xl opacity-70"></div>
                <img
                  src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&q=80"
                  alt="TheBestYou Mobile App"
                  className="relative z-10 rounded-[2rem] border-8 border-background shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-24 bg-card" id="pricing">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              Simple, Transparent Pricing
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Choose the perfect plan for your self-improvement journey. No
              hidden fees.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {plans?.map((item: any) => (
              <PricingCard key={item.id} item={item} user={user} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4 text-foreground">
              What Our Users Say
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Join thousands of satisfied users who have transformed their lives
              with TheBestYou.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              {
                name: "Sarah J.",
                role: "Fitness Enthusiast",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=sarah",
                quote:
                  "TheBestYou has completely transformed my fitness journey. The strength training tracker helps me stay consistent and see my progress visually.",
              },
              {
                name: "Michael T.",
                role: "Nutrition Coach",
                image:
                  "https://api.dicebear.com/7.x/avataaars/svg?seed=michael",
                quote:
                  "As a nutrition coach, I recommend TheBestYou to all my clients. The AI food recognition is incredibly accurate and saves so much time logging meals.",
              },
              {
                name: "Emily R.",
                role: "Productivity Expert",
                image: "https://api.dicebear.com/7.x/avataaars/svg?seed=emily",
                quote:
                  "The habit tracking feature has helped me build consistency in my daily routines. I've never stuck with habits this long before using TheBestYou.",
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="p-8 bg-background rounded-xl border border-border shadow-sm"
              >
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full bg-primary/10"
                  />
                  <div>
                    <h4 className="font-semibold text-foreground">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
                <p className="text-foreground italic">"{testimonial.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary/20 via-background to-accent/20">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4 text-foreground">
            Ready to Become The Best You?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of users who are transforming their lives with our
            comprehensive self-improvement platform.
          </p>
          <Button
            asChild
            size="lg"
            className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
          >
            <Link href="/sign-up">
              Start Your Journey Now
              <ArrowUpRight className="ml-2 w-5 h-5" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
}
