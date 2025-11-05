import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  GitBranch, 
  GitPullRequest, 
  FileText, 
  CheckCircle, 
  ArrowLeft,
  Code,
  Users,
  MessageSquare
} from "lucide-react";
import { Link } from "react-router-dom";

const Guidance = () => {
  const contributionSteps = [
    {
      icon: <GitBranch className="h-5 w-5" />,
      title: "Fork the Repository",
      description: "Create your own copy of the project",
      details: "Click the 'Fork' button on the GitHub repository page to create a copy in your account."
    },
    {
      icon: <Code className="h-5 w-5" />,
      title: "Clone & Setup",
      description: "Get the code on your local machine",
      details: "Clone your fork locally and set up the development environment as described in the README."
    },
    {
      icon: <GitBranch className="h-5 w-5" />,
      title: "Create a Branch",
      description: "Make a new branch for your changes",
      details: "Create a descriptive branch name like 'fix-login-bug' or 'add-dark-mode'."
    },
    {
      icon: <FileText className="h-5 w-5" />,
      title: "Make Changes",
      description: "Implement your solution",
      details: "Write clean, well-documented code that follows the project's style guidelines."
    },
    {
      icon: <CheckCircle className="h-5 w-5" />,
      title: "Test Your Changes",
      description: "Ensure everything works correctly",
      details: "Run the existing tests and add new ones if necessary. Test manually as well."
    },
    {
      icon: <GitPullRequest className="h-5 w-5" />,
      title: "Submit Pull Request",
      description: "Share your contribution",
      details: "Create a pull request with a clear description of what you've changed and why."
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-background">

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Contributing to Open Source
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            A comprehensive guide to making your first (or next) open source contribution. 
            Learn the process, best practices, and common templates used in the community.
          </p>
        </div>

        {/* Step-by-Step Process */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GitPullRequest className="h-5 w-5" />
              Contribution Process
            </CardTitle>
            <CardDescription>
              Follow these steps to make a successful contribution to any open source project
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {contributionSteps.map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0">
                    <div className="bg-primary/10 text-primary p-2 rounded-lg">
                      {step.icon}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">
                      {index + 1}. {step.title}
                    </h3>
                    <p className="text-muted-foreground mb-2">{step.description}</p>
                    <p className="text-xs text-muted-foreground">{step.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Templates Section */}
        <div className="grid gap-8 md:grid-cols-2">
          {/* Pull Request Template */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitPullRequest className="h-5 w-5" />
                Pull Request Template
              </CardTitle>
              <CardDescription>
                Use this template to write clear, informative pull requests
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
                <div className="text-foreground">
                  <div className="font-semibold mb-2">## Description</div>
                  <div className="text-muted-foreground mb-4">
                    Brief description of what this PR does
                  </div>
                  
                  <div className="font-semibold mb-2">## Type of Change</div>
                  <div className="text-muted-foreground mb-4">
                    - [ ] Bug fix<br/>
                    - [ ] New feature<br/>
                    - [ ] Breaking change<br/>
                    - [ ] Documentation update
                  </div>
                  
                  <div className="font-semibold mb-2">## Testing</div>
                  <div className="text-muted-foreground mb-4">
                    Describe how you tested your changes
                  </div>
                  
                  <div className="font-semibold mb-2">## Checklist</div>
                  <div className="text-muted-foreground">
                    - [ ] Code follows style guidelines<br/>
                    - [ ] Tests pass<br/>
                    - [ ] Documentation updated
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Issue Template */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5" />
                Issue Template
              </CardTitle>
              <CardDescription>
                Use this template when reporting bugs or requesting features
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm">
                <div className="text-foreground">
                  <div className="font-semibold mb-2">## Issue Type</div>
                  <div className="text-muted-foreground mb-4">
                    [ ] Bug Report [ ] Feature Request
                  </div>
                  
                  <div className="font-semibold mb-2">## Description</div>
                  <div className="text-muted-foreground mb-4">
                    Clear description of the issue or feature
                  </div>
                  
                  <div className="font-semibold mb-2">## Steps to Reproduce</div>
                  <div className="text-muted-foreground mb-4">
                    1. Go to '...'<br/>
                    2. Click on '....'<br/>
                    3. See error
                  </div>
                  
                  <div className="font-semibold mb-2">## Expected Behavior</div>
                  <div className="text-muted-foreground mb-4">
                    What should happen
                  </div>
                  
                  <div className="font-semibold mb-2">## Environment</div>
                  <div className="text-muted-foreground">
                    - OS: [e.g. iOS]<br/>
                    - Browser: [e.g. chrome, safari]<br/>
                    - Version: [e.g. 22]
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Separator className="my-8" />

        {/* Best Practices */}
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Best Practices
            </CardTitle>
            <CardDescription>
              Tips for successful open source contributions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Code className="h-4 w-4" />
                  Code Quality
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Follow the project's coding style</li>
                  <li>• Write clear, descriptive commit messages</li>
                  <li>• Keep changes focused and minimal</li>
                  <li>• Add tests for new functionality</li>
                  <li>• Update documentation when needed</li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Community Etiquette
                </h3>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Be respectful and patient</li>
                  <li>• Read contribution guidelines first</li>
                  <li>• Ask questions if you're unsure</li>
                  <li>• Respond to feedback constructively</li>
                  <li>• Be open to suggestions and changes</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Popular Labels Guide */}
        <Card className="mt-8 shadow-lg">
          <CardHeader>
            <CardTitle>Understanding Issue Labels</CardTitle>
            <CardDescription>
              Common labels used in open source projects and what they mean
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 hover:bg-green-100 dark:hover:bg-green-900">good first issue</Badge>
                <p className="text-sm text-muted-foreground">Perfect for newcomers to the project</p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-primary/10 text-primary hover:bg-primary/20">help wanted</Badge>
                <p className="text-sm text-muted-foreground">Maintainers are looking for help on this issue</p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-destructive/10 text-destructive hover:bg-destructive/20">bug</Badge>
                <p className="text-sm text-muted-foreground">Something isn't working as expected</p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200 hover:bg-purple-100 dark:hover:bg-purple-900">enhancement</Badge>
                <p className="text-sm text-muted-foreground">New feature or improvement request</p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 hover:bg-yellow-100 dark:hover:bg-yellow-900">documentation</Badge>
                <p className="text-sm text-muted-foreground">Improvements to documentation needed</p>
              </div>
              <div className="space-y-2">
                <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200 hover:bg-orange-100 dark:hover:bg-orange-900">hacktoberfest</Badge>
                <p className="text-sm text-muted-foreground">Eligible for Hacktoberfest contributions</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Guidance;
