import React from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-950 overflow-hidden ml-52 flex">
  {/* Page Content */}
  <div className="flex-1 overflow-x-hidden ">
    {/* Hero Section */}
    <div className="relative min-h-[60vh] flex items-center">
        {/* Gradient Background */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(20,184,166,0.15),transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,rgba(20,184,166,0.15),transparent_50%)]" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="flex justify-center">
              <Badge
                variant="secondary"
                className="bg-teal-400/10 text-teal-500 border-teal-400/10 px-6 py-2 text-sm backdrop-blur-sm"
              >
                Welcome to Web3 Learning
              </Badge>
            </div>

            <h1 className="text-7xl font-bold tracking-tight">
              <span className="text-white">Learn on </span>
              <span className="text-teal-400">Learnopoly</span>
            </h1>

            <p className="text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed">
              Experience the future of education with blockchain-verified
              credentials and personalized learning paths
            </p>

            <div className="flex justify-center gap-6 pt-4">
              <Button
                size="lg"
                className="bg-teal-400 hover:bg-teal-500 text-slate-900 px-8 py-6 text-lg font-medium rounded-xl"
              >
                Start Learning
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="border-slate-700 text-slate-600 hover:bg-slate-800 hover:text-teal-400 px-8 py-6 text-lg font-medium rounded-xl"
              >
                Explore Courses
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { number: "10k+", label: "Active Learners" },
            { number: "500+", label: "Verified Courses" },
            { number: "1M+", label: "Credentials Issued" },
            { number: "50+", label: "Partner Institutions" },
          ].map((stat, index) => (
            <div key={index} className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-teal-400/10 to-transparent rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100" />
              <Card className="relative bg-slate-900/50 border-slate-800/50 overflow-hidden backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="text-center">
                    <div className="text-5xl font-bold text-teal-400 mb-3 group-hover:scale-110 transition-transform duration-300">
                      {stat.number}
                    </div>
                    <div className="text-sm text-slate-400 font-medium">
                      {stat.label}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      </div>

      {/* Features Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="inline-flex bg-slate-900/50 p-1 rounded-xl backdrop-blur-sm">
            {[
              "Credentials",
              "Learning Path",
              "Community",
              "Rewards",
              "Jobs",
            ].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab.toLowerCase()}
                className="px-8 py-3 rounded-lg text-sm font-medium transition-all duration-300 data-[state=active]:bg-teal-400/10 data-[state=active]:text-teal-400"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="credentials" className="mt-8">
            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  title: "Verified Credentials",
                  description: "Blockchain-secured certificates",
                  features: [
                    "Tamper-proof",
                    "Instant verification",
                    "Global recognition",
                  ],
                },
                {
                  title: "Skill Passport",
                  description: "Your digital learning portfolio",
                  features: ["Cross-platform", "Standardized", "Shareable"],
                },
                {
                  title: "Smart Certificates",
                  description: "Next-gen digital credentials",
                  features: [
                    "Auto-verification",
                    "Rich metadata",
                    "Integration ready",
                  ],
                },
              ].map((card, index) => (
                <Card
                  key={index}
                  className="group bg-slate-900/50 border-slate-800/50 hover:border-teal-400/20 backdrop-blur-sm transition-all duration-300"
                >
                  <CardHeader>
                    <CardTitle className="text-teal-400">
                      {card.title}
                    </CardTitle>
                    <CardDescription className="text-slate-400">
                      {card.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {card.features.map((feature, i) => (
                        <li key={i} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-teal-400/50" />
                          <span className="text-slate-300">{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* CTA Section */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="absolute inset-0 bg-teal-400/5 rounded-3xl blur-3xl" />
        <Card className="relative border-slate-800/50 bg-slate-900/50 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-12 text-center">
            <h2 className="text-4xl font-bold text-white mb-4">
              Ready to Start Your Learning Journey?
            </h2>
            <p className="text-lg text-slate-400 mb-8 max-w-2xl mx-auto">
              Join thousands of learners already transforming their careers with
              blockchain-verified credentials
            </p>
            <Button
              size="lg"
              className="bg-teal-400 hover:bg-teal-500 text-slate-900 px-8 py-6 text-lg font-medium rounded-xl"
            >
              Get Started Now
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </div>
  );
}