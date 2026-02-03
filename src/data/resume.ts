export const resumeCode = `package resume

/******************************************************************************
 * PROFILE
 ******************************************************************************/
var Profile = Profile{
    Name:    "Zidan Omar Hamid",
    Role:    "Software Engineer",
    Summary: "Building scalable backend systems & smooth frontend experiences.",
}

const (
    Email   = "zidanomar@430am.dev",
    Website = "https://430am.dev",
    Github  = "github.com/zidanomar"
)

/******************************************************************************
 * EXPERIENCES
 ******************************************************************************/
var Experiences = []Experience{
    {
        Company: "VIVAVIS Water",
        Role:    "Software Engineer",
        Time:    "May 2022 - Present",
        Stack:   []string{"Go", "NodeJS", "TimescaleDB", "K8s", "GCP"},
        Work: []string{
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
        Work: []string{
            "Implemented secure RBAC for mission-critical workflows.",
            "Designed scalable database schemas & migration strategies.",
        },
    },
    {
        Company: "Bandung Institute of Technology",
        Role:    "Network Engineer Intern",
        Time:    "Jan 2017 - Mar 2017",
        Work: []string{
            "Managed routing, firewalls, and campus Wi-Fi authentication.",
        },
    },
}

/******************************************************************************
 * EDUCATIONS
 ******************************************************************************/
var Educations = []Education{
    {
        School: "Sakarya University",
        Major:  "Computer Engineering",
    },
    {
        School: "Daarut Tauhiid Vocational High School",
        Major:  "Computer and Network Engineering",
    },
}

/******************************************************************************
 * TECH STACK
 ******************************************************************************/
var TechStack = []string{
    "Go", "TypeScript", "SQL",
    "NestJS", "React", "Vue", "Go Fiber",
    "Docker", "K8s", "Postgres", "Redis", "Kafka", "gRPC",
}
`;
