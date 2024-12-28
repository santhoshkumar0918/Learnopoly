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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center space-y-4">
            <Badge variant="secondary" className="mb-4">
              Built on EduChain
            </Badge>
            <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-6">
              Welcome to Learnopoly
            </h1>
            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
              Empowering lifelong learning through blockchain-verified
              credentials
            </p>
            <div className="flex justify-center gap-4">
              <Button size="lg">Get Started</Button>
              <Button variant="outline" size="lg">
                Learn More
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Features Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <Tabs defaultValue="credentials" className="w-full">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
            <TabsTrigger value="credentials">Credentials</TabsTrigger>
            <TabsTrigger value="passport">Learning Passport</TabsTrigger>
            <TabsTrigger value="gamification">Gamification</TabsTrigger>
            <TabsTrigger value="networking">Networking</TabsTrigger>
            <TabsTrigger value="jobs">Job Board</TabsTrigger>
          </TabsList>
          <TabsContent value="credentials" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Blockchain-Backed Credentials</CardTitle>
                <CardDescription>
                  Secure, tamper-proof certificates and badges stored on the
                  blockchain
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="font-medium">Key Features:</h4>
                    <ul className="list-disc pl-4 space-y-1">
                      <li>Tamper-proof certificates</li>
                      <li>Digital badges</li>
                      <li>Instant verification</li>
                    </ul>
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
                    <p className="text-sm">
                      Your achievements are securely stored on the blockchain,
                      giving you complete ownership and control.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          {/* Similar TabsContent for other features */}
        </Tabs>
      </div>

      {/* Stats Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          <StatCard number="10k+" label="Active Learners" />
          <StatCard number="500+" label="Verified Courses" />
          <StatCard number="1M+" label="Credentials Issued" />
          <StatCard number="50+" label="Partner Institutions" />
        </div>
      </div>

      {/* Feature Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Passport</CardTitle>
              <CardDescription>
                Your unified record of formal and informal learning achievements
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Badge variant="outline">Verified</Badge>
                  <span>Blockchain-backed records</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">Portable</Badge>
                  <span>Take your credentials anywhere</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Gamified Learning</CardTitle>
              <CardDescription>
                Earn rewards while mastering new skills
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Badge variant="outline">Rewards</Badge>
                  <span>Earn ERC-20 tokens</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">Compete</Badge>
                  <span>Join global leaderboards</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Job Board</CardTitle>
              <CardDescription>
                Smart contract-powered job matching
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <Badge variant="outline">Smart</Badge>
                  <span>AI-powered matching</span>
                </li>
                <li className="flex items-center gap-2">
                  <Badge variant="outline">Verified</Badge>
                  <span>Credential-based applications</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

interface StatCardProps {
  number: string;
  label: string;
}

const StatCard = ({ number, label }: StatCardProps) => (
  <Card>
    <CardContent className="pt-6">
      <div className="text-center">
        <div className="text-4xl font-bold text-primary mb-2">{number}</div>
        <div className="text-sm text-muted-foreground">{label}</div>
      </div>
    </CardContent>
  </Card>
);
