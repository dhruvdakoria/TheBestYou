import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  Dumbbell,
  Utensils,
  LineChart,
} from "lucide-react";
import { Button } from "./ui/button";

export default function Hero() {
  return (
    <div className="relative overflow-hidden bg-background">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/5 opacity-70 dark:opacity-30" />

      <div className="relative pt-24 pb-32 sm:pt-32 sm:pb-40">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl sm:text-6xl font-bold text-foreground mb-8 tracking-tight">
              Become{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400">
                The Best You
              </span>{" "}
              with AI-Powered Tracking
            </h1>

            <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Track your fitness, nutrition, and habits with our sleek,
              AI-powered self-improvement platform. Achieve your goals faster
              with personalized insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button
                asChild
                size="lg"
                className="bg-primary hover:bg-primary/90 text-lg px-8 py-6"
              >
                <Link href="/sign-up">
                  Start Your Journey
                  <ArrowUpRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="text-lg px-8 py-6"
              >
                <Link href="#features">Explore Features</Link>
              </Button>
            </div>

            <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>14-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-5 h-5 text-primary" />
                <span>Cancel anytime</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* App Preview Section */}
      <div className="container mx-auto px-4 pb-24">
        <div className="relative mx-auto max-w-5xl rounded-xl overflow-hidden shadow-2xl border border-border">
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10 mix-blend-overlay"></div>
          <img
            src="https://images.unsplash.com/photo-1607962837359-5e7e89f86776?w=1200&q=80"
            alt="TheBestYou Dashboard"
            className="w-full h-auto rounded-xl"
          />
        </div>

        {/* Feature Icons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 max-w-4xl mx-auto">
          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Dumbbell className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Strength Training</h3>
            <p className="text-muted-foreground">
              Track your workouts, sets, reps, and weight with detailed
              progression graphs.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <Utensils className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">AI Nutrition</h3>
            <p className="text-muted-foreground">
              Log meals with AI image recognition and get personalized macro
              recommendations.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4">
              <LineChart className="w-8 h-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Habit Tracking</h3>
            <p className="text-muted-foreground">
              Build consistency with our habit tracking system and visualize
              your progress.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
