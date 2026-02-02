export const resumeCode = `package main

import (
    "fmt"
    "time"
)

func main() {
    zidan := Engineer{
        Name:    "Zidan Omar Hamid",
        Role:    "Software Engineer",
        Summary: "Building scalable backend systems & smooth frontend experiences.",
        
        Contact: ContactInfo{
            Email:   "zidanomar@430am.dev",
            Website: "https://430am.dev",
            Github:  "github.com/zidanomar",
        },

        Experience: []Job{
            {
                Company: "VIVAVIS Water",
                Role:    "Software Engineer",
                Time:    "May 2022 - Present",
                Stack:   []string{"Go", "NodeJS", "TimescaleDB", "K8s"},
                Highlights: []string{
                    "Designed scalable IoT ingestion for thousands of devices.",
                    "Built parsers for ModBus & M-Bus protocols.",
                    "Improved query speeds with TimescaleDB time-series data.",
                    "Migrated VM deployments to GKE (Kubernetes).",
                    "Automated releases with Jenkins CI/CD pipelines.",
                },
            },
            {
                Company: "Turkish Aerospace Industries",
                Role:    "Software Developer Intern",
                Time:    "Nov 2021 - Jan 2022",
                Highlights: []string{
                    "Implemented secure RBAC for mission-critical workflows.",
                    "Designed scalable database schemas & migration strategies.",
                },
            },
            {
                Company: "Bandung Institute of Technology",
                Role:    "Network Engineer Intern",
                Time:    "Jan 2017 - Mar 2017",
                Highlights: []string{
                    "Managed routing, firewalls, and campus Wi-Fi authentication.",
                },
            },
        },

        Education: Degree{
            School: "Sakarya University",
            Major:  "Computer Engineering",
        },

        Skills: TechStack{
            Languages: []string{"Go", "TypeScript", "SQL"},
            Frameworks: []string{"NestJS", "React", "Vue", "Fiber"},
            Core:      []string{"Docker", "K8s", "Postgres", "Redis", "Kafka", "gRPC"},
        },
    }
}
`;
