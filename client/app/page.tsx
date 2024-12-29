// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";

// export default function Home() {

//   return (

//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
//       {/* Hero Section */}
//       <div className="relative overflow-hidden">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
//           <div className="text-center space-y-4">
//             <Badge variant="secondary" className="mb-4">
//               Built on EduChain
//             </Badge>
//             <h1 className="text-5xl font-bold text-slate-900 dark:text-slate-50 mb-6">
//               Welcome to Learnopoly
//             </h1>
//             <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-2xl mx-auto">
//               Empowering lifelong learning through blockchain-verified
//               credentials
//             </p>
//             <div className="flex justify-center gap-4">
//               <Button size="lg">Get Started</Button>
//               <Button variant="outline" size="lg">
//                 Learn More
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Tabs */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <Tabs defaultValue="credentials" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5">
//             <TabsTrigger value="credentials">Credentials</TabsTrigger>
//             <TabsTrigger value="passport">Learning Passport</TabsTrigger>
//             <TabsTrigger value="gamification">Gamification</TabsTrigger>
//             <TabsTrigger value="networking">Networking</TabsTrigger>
//             <TabsTrigger value="jobs">Job Board</TabsTrigger>
//           </TabsList>
//           <TabsContent value="credentials" className="mt-6">
//             <Card>
//               <CardHeader>
//                 <CardTitle>Blockchain-Backed Credentials</CardTitle>
//                 <CardDescription>
//                   Secure, tamper-proof certificates and badges stored on the
//                   blockchain
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2">
//                     <h4 className="font-medium">Key Features:</h4>
//                     <ul className="list-disc pl-4 space-y-1">
//                       <li>Tamper-proof certificates</li>
//                       <li>Digital badges</li>
//                       <li>Instant verification</li>
//                     </ul>
//                   </div>
//                   <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg">
//                     <p className="text-sm">
//                       Your achievements are securely stored on the blockchain,
//                       giving you complete ownership and control.
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Stats Grid */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//           <StatCard number="10k+" label="Active Learners" />
//           <StatCard number="500+" label="Verified Courses" />
//           <StatCard number="1M+" label="Credentials Issued" />
//           <StatCard number="50+" label="Partner Institutions" />
//         </div>
//       </div>

//       {/* Feature Cards */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="grid md:grid-cols-3 gap-6">
//           <Card>
//             <CardHeader>
//               <CardTitle>Learning Passport</CardTitle>
//               <CardDescription>
//                 Your unified record of formal and informal learning achievements
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-2">
//                 <li className="flex items-center gap-2">
//                   <Badge variant="outline">Verified</Badge>
//                   <span>Blockchain-backed records</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <Badge variant="outline">Portable</Badge>
//                   <span>Take your credentials anywhere</span>
//                 </li>
//               </ul>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Gamified Learning</CardTitle>
//               <CardDescription>
//                 Earn rewards while mastering new skills
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-2">
//                 <li className="flex items-center gap-2">
//                   <Badge variant="outline">Rewards</Badge>
//                   <span>Earn ERC-20 tokens</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <Badge variant="outline">Compete</Badge>
//                   <span>Join global leaderboards</span>
//                 </li>
//               </ul>
//             </CardContent>
//           </Card>

//           <Card>
//             <CardHeader>
//               <CardTitle>Job Board</CardTitle>
//               <CardDescription>
//                 Smart contract-powered job matching
//               </CardDescription>
//             </CardHeader>
//             <CardContent>
//               <ul className="space-y-2">
//                 <li className="flex items-center gap-2">
//                   <Badge variant="outline">Smart</Badge>
//                   <span>AI-powered matching</span>
//                 </li>
//                 <li className="flex items-center gap-2">
//                   <Badge variant="outline">Verified</Badge>
//                   <span>Credential-based applications</span>
//                 </li>
//               </ul>
//             </CardContent>
//           </Card>
//         </div>
//       </div>
//     </div>
//   );
// }

// interface StatCardProps {
//   number: string;
//   label: string;
// }

// const StatCard = ({ number, label }: StatCardProps) => (

//   <Card>
//     <CardContent className="pt-6">
//       <div className="text-center">
//         <div className="text-4xl font-bold text-primary mb-2">{number}</div>
//         <div className="text-sm text-muted-foreground">{label}</div>
//       </div>
//     </CardContent>
//   </Card>
// );



// import React from "react";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
//   CardDescription,
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Badge } from "@/components/ui/badge";

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-slate-950">
//       <div className="relative overflow-hidden">
//         <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950" />
//         <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_50%_50%,rgba(20,184,166,0.1),transparent_50%)]" />
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 relative">
//           <div className="text-center space-y-4">
//             <Badge
//               variant="secondary"
//               className="mb-4 bg-teal-400/10 text-teal-400 border-teal-400/20 backdrop-blur-sm"
//             >
//               Built on EduChain
//             </Badge>
//             <h1 className="text-6xl font-bold mb-6">
//               <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-teal-200">
//                 Welcome to Learnopoly
//               </span>
//             </h1>
//             <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
//               Empowering lifelong learning through blockchain-verified
//               credentials
//             </p>
//             <div className="flex justify-center gap-4">
//               <Button
//                 size="lg"
//                 className="bg-teal-400 hover:bg-teal-500 text-slate-900 shadow-lg shadow-teal-400/20"
//               >
//                 Get Started
//               </Button>
//               <Button
//                 variant="outline"
//                 size="lg"
//                 className="border-teal-400/20 text-teal-400 hover:bg-teal-400/10"
//               >
//                 Learn More
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Features Tabs */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <Tabs defaultValue="credentials" className="w-full">
//           <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 bg-slate-900/50 backdrop-blur-sm">
//             <TabsTrigger
//               value="credentials"
//               className="data-[state=active]:bg-teal-400/10 data-[state=active]:text-teal-400"
//             >
//               Credentials
//             </TabsTrigger>
//             <TabsTrigger
//               value="passport"
//               className="data-[state=active]:bg-teal-400/10 data-[state=active]:text-teal-400"
//             >
//               Learning Passport
//             </TabsTrigger>
//             <TabsTrigger
//               value="gamification"
//               className="data-[state=active]:bg-teal-400/10 data-[state=active]:text-teal-400"
//             >
//               Gamification
//             </TabsTrigger>
//             <TabsTrigger
//               value="networking"
//               className="data-[state=active]:bg-teal-400/10 data-[state=active]:text-teal-400"
//             >
//               Networking
//             </TabsTrigger>
//             <TabsTrigger
//               value="jobs"
//               className="data-[state=active]:bg-teal-400/10 data-[state=active]:text-teal-400"
//             >
//               Job Board
//             </TabsTrigger>
//           </TabsList>
//           <TabsContent value="credentials" className="mt-6">
//             <Card className="bg-slate-900/50 border-slate-800 backdrop-blur-sm">
//               <CardHeader>
//                 <CardTitle className="text-teal-400">
//                   Blockchain-Backed Credentials
//                 </CardTitle>
//                 <CardDescription className="text-slate-400">
//                   Secure, tamper-proof certificates and badges stored on the
//                   blockchain
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <div className="grid md:grid-cols-2 gap-4">
//                   <div className="space-y-2 text-slate-300">
//                     <h4 className="font-medium text-teal-400">Key Features:</h4>
//                     <ul className="list-disc pl-4 space-y-1">
//                       <li>Tamper-proof certificates</li>
//                       <li>Digital badges</li>
//                       <li>Instant verification</li>
//                     </ul>
//                   </div>
//                   <div className="bg-slate-800/50 p-4 rounded-lg border border-slate-700">
//                     <p className="text-sm text-slate-300">
//                       Your achievements are securely stored on the blockchain,
//                       giving you complete ownership and control.
//                     </p>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>
//           </TabsContent>
//         </Tabs>
//       </div>

//       {/* Stats Grid with Hover Effects */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
//           <StatCard number="10k+" label="Active Learners" />
//           <StatCard number="500+" label="Verified Courses" />
//           <StatCard number="1M+" label="Credentials Issued" />
//           <StatCard number="50+" label="Partner Institutions" />
//         </div>
//       </div>

//       {/* Feature Cards with Gradient Borders */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
//         <div className="grid md:grid-cols-3 gap-6">
//           {[
//             {
//               title: "Learning Passport",
//               description:
//                 "Your unified record of formal and informal learning achievements",
//               badges: [
//                 { label: "Verified", text: "Blockchain-backed records" },
//                 { label: "Portable", text: "Take your credentials anywhere" },
//               ],
//             },
//             {
//               title: "Gamified Learning",
//               description: "Earn rewards while mastering new skills",
//               badges: [
//                 { label: "Rewards", text: "Earn ERC-20 tokens" },
//                 { label: "Compete", text: "Join global leaderboards" },
//               ],
//             },
//             {
//               title: "Job Board",
//               description: "Smart contract-powered job matching",
//               badges: [
//                 { label: "Smart", text: "AI-powered matching" },
//                 { label: "Verified", text: "Credential-based applications" },
//               ],
//             },
//           ].map((feature, index) => (
//             <Card
//               key={index}
//               className="group bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-teal-400/20 transition-all duration-300"
//             >
//               <CardHeader>
//                 <CardTitle className="text-teal-400">{feature.title}</CardTitle>
//                 <CardDescription className="text-slate-400">
//                   {feature.description}
//                 </CardDescription>
//               </CardHeader>
//               <CardContent>
//                 <ul className="space-y-2">
//                   {feature.badges.map((badge, i) => (
//                     <li key={i} className="flex items-center gap-2">
//                       <Badge
//                         variant="outline"
//                         className="bg-teal-400/10 text-teal-400 border-teal-400/20"
//                       >
//                         {badge.label}
//                       </Badge>
//                       <span className="text-slate-300">{badge.text}</span>
//                     </li>
//                   ))}
//                 </ul>
//               </CardContent>
//             </Card>
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

// interface StatCardProps {
//   number: string;
//   label: string;
// }

// const StatCard = ({ number, label }: StatCardProps) => (
//   <Card className="group bg-slate-900/50 border-slate-800 backdrop-blur-sm hover:border-teal-400/20 transition-all duration-300">
//     <CardContent className="pt-6">
//       <div className="text-center">
//         <div className="text-4xl font-bold text-teal-400 mb-2 group-hover:scale-110 transition-transform duration-300">
//           {number}
//         </div>
//         <div className="text-sm text-slate-400">{label}</div>
//       </div>
//     </CardContent>
//   </Card>
// );


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
    <div className="min-h-screen bg-slate-950">
      {/* Hero Section */}
      <div className="relative min-h-[80vh] flex items-center">
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
  );
}