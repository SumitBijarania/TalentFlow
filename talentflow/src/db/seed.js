import { faker } from '@faker-js/faker';

const getRandomRecentDate = () => {
  const date = new Date();
  date.setMonth(date.getMonth() - Math.floor(Math.random() * 6));
  return date;
};

const getRandomItems = (array, min, max) => {
  const count = min + Math.floor(Math.random() * (max - min + 1));
  return Array.from({ length: count }, () => array[Math.floor(Math.random() * array.length)]);
};

const JOB_TITLES = [
  'Software Engineer', 'Product Manager', 'UX Designer', 'Data Scientist',
  'DevOps Engineer', 'Frontend Developer', 'Backend Developer', 'Full Stack Developer',
  'QA Engineer', 'Technical Writer', 'Project Manager', 'Business Analyst',
  'System Administrator', 'Security Engineer', 'Machine Learning Engineer'
];

const SKILLS = [
  'JavaScript', 'Python', 'Java', 'React', 'Node.js', 'AWS', 'Docker',
  'Kubernetes', 'SQL', 'NoSQL', 'Git', 'CI/CD', 'Agile', 'TypeScript',
  'GraphQL', 'REST', 'Vue.js', 'Angular', 'Ruby', 'Go', 'Rust'
];

const LOCATIONS = [
  'Remote', 'New York', 'San Francisco', 'London', 'Berlin', 'Tokyo',
  'Singapore', 'Sydney', 'Toronto', 'Amsterdam'
];

const JOB_DESCRIPTIONS = {
  'Software Engineer': 'We are seeking a talented Software Engineer to join our development team. You will be responsible for designing, developing, and maintaining software applications. The ideal candidate has strong problem-solving skills and experience with modern development practices.',
  'Frontend Developer': 'Join our team as a Frontend Developer where you will create responsive and intuitive user interfaces. You will work with modern JavaScript frameworks and collaborate closely with designers and backend developers to deliver exceptional user experiences.',
  'Backend Developer': 'We are looking for a Backend Developer to build and maintain server-side applications. You will design APIs, work with databases, and ensure our systems are scalable, secure, and performant.',
  'Full Stack Developer': 'As a Full Stack Developer, you will work on both frontend and backend systems. You will be responsible for the complete development lifecycle from database design to user interface implementation.',
  'DevOps Engineer': 'We need a DevOps Engineer to help us automate and streamline our operations. You will work on CI/CD pipelines, infrastructure as code, container orchestration, and cloud infrastructure management.',
  'Data Scientist': 'Join us as a Data Scientist to analyze complex datasets and build machine learning models. You will work on extracting insights from data and implementing predictive models to drive business decisions.',
  'QA Engineer': 'We are seeking a QA Engineer to ensure the quality of our software products. You will design test strategies, write automated tests, and work closely with development teams to identify and resolve issues.',
  'Product Manager': 'As a Product Manager, you will define product vision and strategy. You will work with cross-functional teams to deliver products that meet customer needs and drive business growth.',
  'UX Designer': 'We are looking for a UX Designer to create user-centered designs. You will conduct user research, create wireframes and prototypes, and collaborate with developers to implement intuitive interfaces.',
  'Technical Writer': 'Join our team as a Technical Writer to create clear and comprehensive documentation. You will write user guides, API documentation, and help content for our products.',
  'Project Manager': 'We need a Project Manager to lead software development projects. You will coordinate teams, manage timelines, and ensure projects are delivered on time and within budget.',
  'Business Analyst': 'As a Business Analyst, you will bridge the gap between business needs and technical solutions. You will gather requirements, analyze processes, and help design solutions that meet business objectives.',
  'System Administrator': 'We are seeking a System Administrator to manage our IT infrastructure. You will maintain servers, ensure system security, and provide technical support to our teams.',
  'Security Engineer': 'Join us as a Security Engineer to protect our systems and data. You will implement security measures, conduct vulnerability assessments, and respond to security incidents.',
  'Machine Learning Engineer': 'We are looking for a Machine Learning Engineer to build and deploy ML models. You will work on model development, optimization, and production deployment of AI solutions.'
};

export const generateJobs = () => {
  return Array.from({ length: 25 }, (_, index) => {
    const status = Math.random() > 0.3 ? 'active' : 'archived';
    const requiredSkills = getRandomItems(SKILLS, 3, 6);
    const title = faker.helpers.arrayElement(JOB_TITLES);
    const description = JOB_DESCRIPTIONS[title] || 'We are seeking a talented professional to join our team. You will work on exciting projects and collaborate with skilled colleagues to deliver high-quality results.';

    return {
      id: String(index + 1),
      title,
      description,
      status,
      location: faker.helpers.arrayElement(LOCATIONS),
      department: faker.commerce.department(),
      postedDate: getRandomRecentDate(),
      requiredSkills,
      experienceLevel: faker.helpers.arrayElement(['Entry', 'Mid', 'Senior', 'Lead']),
      employmentType: faker.helpers.arrayElement(['Full-time', 'Part-time', 'Contract']),
      order: index
    };
  });
};


const getTechnicalQuestions = (jobTitle) => {
    const generalQuestions = [
      {
        id: crypto.randomUUID(),
        type: 'multi-choice',
        text: 'Which of the following technologies have you worked with?',
        required: true,
        options: ['JavaScript', 'Python', 'Java', 'C++', 'Ruby', 'Go']
      },
      {
        id: crypto.randomUUID(),
        type: 'single-choice',
        text: 'How many years of experience do you have in software development?',
        required: true,
        options: ['0-2 years', '3-5 years', '5-8 years', '8+ years']
      }
    ];

    
    const jobSpecificQuestions = {
      'Frontend Developer': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Select all frontend technologies you are proficient in:',
          required: true,
          options: ['React', 'Vue.js', 'Angular', 'TypeScript', 'CSS/SASS', 'Webpack', 'Next.js', 'Redux', 'GraphQL']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which frontend testing frameworks have you used?',
          required: true,
          options: ['Jest', 'React Testing Library', 'Cypress', 'Playwright', 'Selenium', 'Vitest']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Explain how you would optimize a React application for performance. Include specific techniques and tools.',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your experience with responsive design and mobile-first development.',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'Which state management approach do you prefer for complex apps?',
          required: true,
          options: ['Redux Toolkit', 'React Query', 'Zustand', 'Context + Reducer', 'MobX']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you structure a large React codebase for scalability and maintainability?',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'What accessibility (a11y) practices do you apply regularly?',
          required: true,
          options: ['Semantic HTML', 'Keyboard Navigation', 'ARIA Roles', 'Color Contrast', 'Focus Management', 'Screen Reader Testing']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe how you would diagnose and fix a performance regression after a recent UI change.',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'Backend Developer': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which backend technologies are you experienced with?',
          required: true,
          options: ['Node.js', 'Python/Django', 'Java Spring', 'C#/.NET', 'PHP/Laravel', 'Go', 'Ruby on Rails', 'Rust']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Select the databases you have worked with:',
          required: true,
          options: ['PostgreSQL', 'MongoDB', 'MySQL', 'Redis', 'Elasticsearch', 'Cassandra', 'DynamoDB']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Explain your approach to API design and documentation. Include examples of REST vs GraphQL considerations.',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe how you handle database scaling and optimization in high-traffic applications.',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'Preferred API style for complex apps with many clients?',
          required: true,
          options: ['REST', 'GraphQL', 'gRPC', 'Event-driven (Webhooks)']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you design authentication and authorization (JWT, sessions, RBAC/ABAC)?',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which observability tools/practices have you used?',
          required: true,
          options: ['OpenTelemetry', 'Prometheus', 'Grafana', 'ELK/EFK', 'Jaeger', 'Sentry']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a production incident you handled. Root cause? What did you change to prevent recurrence?',
          required: true,
          validation: { maxLength: 1200 }
        }
      ],
      'Full Stack Developer': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Select the areas you have professional experience in:',
          required: true,
          options: ['Frontend Development', 'Backend Development', 'DevOps', 'Database Design', 'System Architecture', 'Cloud Services', 'Mobile Development', 'API Design']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which cloud platforms have you worked with?',
          required: true,
          options: ['AWS', 'Google Cloud', 'Azure', 'DigitalOcean', 'Heroku', 'Vercel', 'Netlify']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a full-stack project you built from scratch, including architecture decisions and scalability considerations.',
          required: true,
          validation: { maxLength: 1500 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you manage state in complex web applications? Discuss your experience with different state management solutions.',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which build and packaging tools do you commonly use?',
          required: true,
          options: ['Vite', 'Webpack', 'Rollup', 'esbuild', 'Babel', 'SWC']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Outline your approach to end-to-end testing across frontend and backend.',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'Preferred database strategy for multi-tenant SaaS?',
          required: true,
          options: ['Shared DB, shared schema', 'Shared DB, separate schema', 'Separate DB per tenant']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe how you would implement feature flags and rollout strategies safely.',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'DevOps Engineer': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which DevOps tools have you worked with?',
          required: true,
          options: ['Docker', 'Kubernetes', 'Jenkins', 'GitLab CI', 'GitHub Actions', 'AWS', 'Terraform', 'Ansible', 'Prometheus']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Select your areas of expertise in cloud services:',
          required: true,
          options: ['Container Orchestration', 'Infrastructure as Code', 'Cloud Security', 'Monitoring/Observability', 'Cost Optimization', 'Disaster Recovery']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your experience with implementing and managing Kubernetes clusters. Include specific challenges and solutions.',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Explain your approach to implementing secure and scalable CI/CD pipelines.',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'Preferred IaC tooling for complex environments?',
          required: true,
          options: ['Terraform', 'Pulumi', 'CloudFormation', 'Ansible']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which SRE practices do you routinely apply?',
          required: true,
          options: ['SLIs/SLOs', 'Error Budgets', 'Blameless Postmortems', 'Chaos Engineering', 'Runbooks', 'Capacity Planning']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you approach secrets management and rotations across environments?',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a major reliability improvement you led. What metrics improved?',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'Data Scientist': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which data science tools and libraries do you use?',
          required: true,
          options: ['Python/Pandas', 'R', 'TensorFlow', 'PyTorch', 'scikit-learn', 'Jupyter', 'SQL', 'Spark']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Select your areas of expertise in machine learning:',
          required: true,
          options: ['Supervised Learning', 'Unsupervised Learning', 'Deep Learning', 'NLP', 'Computer Vision', 'Time Series Analysis', 'Reinforcement Learning']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a data science project where you applied machine learning to solve a business problem.',
          required: true,
          validation: { maxLength: 1500 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you approach feature engineering and selection in your ML projects?',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'Which model evaluation strategies do you use most?',
          required: true,
          options: ['K-fold CV', 'Train/Val/Test Split', 'Nested CV', 'Time-series split']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which MLOps tools have you used?',
          required: true,
          options: ['MLflow', 'Kubeflow', 'Weights & Biases', 'SageMaker', 'DVC', 'Airflow']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you detect and mitigate data drift and model decay in production?',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Discuss methods to ensure fairness, explainability, and compliance in ML systems.',
          required: true,
          validation: { maxLength: 1200 }
        }
      ],
      'QA Engineer': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which testing tools and frameworks have you used?',
          required: true,
          options: ['Selenium', 'Cypress', 'Playwright', 'JUnit', 'TestNG', 'Postman', 'JMeter', 'K6']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Select your areas of testing expertise:',
          required: true,
          options: ['Functional Testing', 'API Testing', 'Performance Testing', 'Security Testing', 'Mobile Testing', 'Accessibility Testing', 'Test Automation']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your approach to creating a comprehensive test strategy for a new product.',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you handle test automation in CI/CD pipelines? Provide specific examples.',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'Preferred test pyramid distribution?',
          required: true,
          options: ['70% unit / 20% integration / 10% E2E', '50/30/20', '30/40/30']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which quality gates do you enforce before release?',
          required: true,
          options: ['Code Coverage', 'Static Analysis', 'Security Scan', 'Performance Baseline', 'Manual Exploratory', 'Accessibility Audit']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you design reliable E2E tests that are resilient to UI changes?',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe how you triage flaky tests and reduce false positives.',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'Business Analyst': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which business analysis tools and techniques do you use?',
          required: true,
          options: ['SWOT Analysis', 'User Stories', 'Process Mapping', 'Stakeholder Analysis', 'Gap Analysis', 'Requirements Gathering', 'Data Modeling']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which software and tools are you proficient in?',
          required: true,
          options: ['JIRA', 'Confluence', 'MS Visio', 'Tableau', 'Power BI', 'Excel/VBA', 'SQL', 'Lucidchart']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your process for gathering and documenting business requirements from stakeholders.',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Explain how you translate business needs into technical specifications for development teams.',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'Which methodology do you prefer for business analysis projects?',
          required: true,
          options: ['Agile/Scrum', 'Waterfall', 'Hybrid', 'Lean']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'What types of analysis do you regularly perform?',
          required: true,
          options: ['Financial Analysis', 'Market Analysis', 'Risk Analysis', 'Cost-Benefit Analysis', 'Competitive Analysis', 'Data Analysis']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a challenging project where you had to balance conflicting stakeholder requirements. How did you resolve it?',
          required: true,
          validation: { maxLength: 1500 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you measure and communicate the success of implemented business solutions?',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'System Administrator': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which operating systems do you have experience administering?',
          required: true,
          options: ['Linux (RHEL/CentOS)', 'Linux (Ubuntu/Debian)', 'Windows Server', 'macOS', 'Unix (Solaris/AIX)']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which system administration and monitoring tools have you used?',
          required: true,
          options: ['Ansible', 'Puppet', 'Chef', 'Nagios', 'Zabbix', 'Prometheus', 'Active Directory', 'LDAP']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your experience with server provisioning, configuration, and maintenance.',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you handle backup and disaster recovery planning for critical systems?',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'What is your preferred approach for patch management?',
          required: true,
          options: ['Automated with testing', 'Scheduled maintenance windows', 'Rolling updates', 'Emergency patches only']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which security practices do you implement for system hardening?',
          required: true,
          options: ['Firewall Configuration', 'SELinux/AppArmor', 'Regular Updates', 'Access Control Lists', 'Intrusion Detection', 'Audit Logging']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a critical system outage you resolved. What was your troubleshooting approach?',
          required: true,
          validation: { maxLength: 1500 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you manage user accounts, permissions, and ensure principle of least privilege?',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'Security Engineer': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which security tools and platforms have you worked with?',
          required: true,
          options: ['SIEM (Splunk/ELK)', 'Vulnerability Scanners', 'Penetration Testing Tools', 'WAF', 'IDS/IPS', 'EDR/XDR']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which areas of security are your expertise?',
          required: true,
          options: ['Application Security', 'Network Security', 'Cloud Security', 'Incident Response', 'Threat Intelligence', 'Security Auditing']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your experience with security vulnerability assessments and penetration testing.',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you approach incident response and security breach investigations?',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'Which security framework do you follow most closely?',
          required: true,
          options: ['NIST Cybersecurity Framework', 'ISO 27001', 'CIS Controls', 'OWASP', 'MITRE ATT&CK']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which compliance standards have you worked with?',
          required: true,
          options: ['SOC 2', 'PCI DSS', 'HIPAA', 'GDPR', 'ISO 27001', 'FedRAMP']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a security architecture improvement you implemented. What was the impact?',
          required: true,
          validation: { maxLength: 1500 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you stay current with emerging security threats and vulnerabilities?',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'Machine Learning Engineer': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which ML frameworks and libraries do you use?',
          required: true,
          options: ['TensorFlow', 'PyTorch', 'Scikit-learn', 'Keras', 'XGBoost', 'Hugging Face', 'JAX']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which ML domains have you worked in?',
          required: true,
          options: ['Computer Vision', 'NLP', 'Recommendation Systems', 'Time Series', 'Reinforcement Learning', 'Generative AI']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your experience deploying ML models to production at scale.',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you approach model optimization and performance tuning?',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'Preferred approach for model serving in production?',
          required: true,
          options: ['REST API', 'gRPC', 'Batch Inference', 'Stream Processing', 'Edge Deployment']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which MLOps tools and practices do you use?',
          required: true,
          options: ['MLflow', 'Kubeflow', 'Feature Stores', 'Model Registry', 'A/B Testing', 'Monitoring/Observability']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe how you handle model versioning, experimentation, and reproducibility.',
          required: true,
          validation: { maxLength: 1500 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you address bias, fairness, and explainability in your ML systems?',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'Software Engineer': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which programming languages are you proficient in?',
          required: true,
          options: ['JavaScript/TypeScript', 'Python', 'Java', 'C++', 'Go', 'Rust', 'C#', 'Ruby']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which software development practices do you follow?',
          required: true,
          options: ['TDD', 'BDD', 'Code Reviews', 'Pair Programming', 'Agile/Scrum', 'CI/CD', 'Design Patterns']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a complex software system you designed and built. What were the key challenges?',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you approach code quality, maintainability, and technical debt?',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'Which architecture pattern do you prefer for large applications?',
          required: true,
          options: ['Microservices', 'Monolithic', 'Modular Monolith', 'Serverless', 'Event-Driven']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which areas of software engineering interest you most?',
          required: true,
          options: ['Backend Systems', 'Frontend UIs', 'Distributed Systems', 'Performance Optimization', 'Security', 'DevOps']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your debugging and troubleshooting methodology for production issues.',
          required: true,
          validation: { maxLength: 1500 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you stay current with new technologies and continuously improve your skills?',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'Product Manager': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which product management frameworks and methodologies do you use?',
          required: true,
          options: ['Agile/Scrum', 'Lean', 'OKRs', 'Design Thinking', 'Jobs-to-be-Done', 'Product-Market Fit']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which PM tools and platforms are you experienced with?',
          required: true,
          options: ['JIRA', 'Aha!', 'ProductBoard', 'Mixpanel', 'Amplitude', 'Figma', 'UserTesting']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your process for defining product vision and strategy.',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you prioritize features and make trade-off decisions?',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'Which prioritization framework do you use most often?',
          required: true,
          options: ['RICE', 'Value vs Effort', 'Kano Model', 'MoSCoW', 'Weighted Scoring']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which types of user research do you conduct?',
          required: true,
          options: ['User Interviews', 'Surveys', 'A/B Testing', 'Usability Testing', 'Analytics Review', 'Customer Feedback']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a product launch you led. What metrics defined success?',
          required: true,
          validation: { maxLength: 1500 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you work with engineering and design teams to deliver products?',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'UX Designer': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which design tools are you proficient in?',
          required: true,
          options: ['Figma', 'Sketch', 'Adobe XD', 'InVision', 'Principle', 'Framer', 'Protopie']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which UX research methods do you regularly use?',
          required: true,
          options: ['User Interviews', 'Usability Testing', 'Card Sorting', 'Journey Mapping', 'Personas', 'Surveys', 'A/B Testing']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your end-to-end UX design process from research to final design.',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you incorporate accessibility and inclusive design principles?',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'How do you validate design decisions?',
          required: true,
          options: ['Usability Testing', 'Analytics', 'User Feedback', 'A/B Testing', 'Heuristic Evaluation']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which areas of UX are your strengths?',
          required: true,
          options: ['Interaction Design', 'Visual Design', 'Information Architecture', 'User Research', 'Prototyping', 'Design Systems']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a challenging UX problem you solved. What was your approach?',
          required: true,
          validation: { maxLength: 1500 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you collaborate with product managers and engineers?',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'Technical Writer': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which types of technical documentation have you created?',
          required: true,
          options: ['API Documentation', 'User Guides', 'Developer Tutorials', 'Release Notes', 'Architecture Docs', 'Knowledge Base']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which documentation tools and platforms do you use?',
          required: true,
          options: ['Markdown', 'Confluence', 'Notion', 'ReadTheDocs', 'GitBook', 'Swagger/OpenAPI', 'MadCap Flare']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your process for creating technical documentation from scratch.',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you ensure documentation is clear, accurate, and accessible to different audiences?',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'How do you handle documentation versioning?',
          required: true,
          options: ['Git-based', 'Version Control in Tool', 'Manual Versioning', 'Automated from Code']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which documentation best practices do you follow?',
          required: true,
          options: ['Docs as Code', 'Style Guides', 'Peer Reviews', 'User Testing', 'SEO Optimization', 'Analytics Tracking']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a complex technical concept you documented. How did you make it understandable?',
          required: true,
          validation: { maxLength: 1500 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you collaborate with engineers and SMEs to gather accurate information?',
          required: true,
          validation: { maxLength: 1000 }
        }
      ],
      'Project Manager': [
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which project management methodologies have you used?',
          required: true,
          options: ['Agile/Scrum', 'Kanban', 'Waterfall', 'Hybrid', 'Prince2', 'SAFe']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which PM tools and platforms are you experienced with?',
          required: true,
          options: ['JIRA', 'Asana', 'Trello', 'Monday.com', 'MS Project', 'Smartsheet', 'Basecamp']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe your approach to project planning, estimation, and scheduling.',
          required: true,
          validation: { maxLength: 1200 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you manage project risks, dependencies, and scope changes?',
          required: true,
          validation: { maxLength: 1000 }
        },
        {
          id: crypto.randomUUID(),
          type: 'single-choice',
          text: 'How do you track and report project progress?',
          required: true,
          options: ['Burn-down Charts', 'Status Reports', 'Dashboards', 'Daily Standups', 'Weekly Reviews']
        },
        {
          id: crypto.randomUUID(),
          type: 'multi-choice',
          text: 'Which aspects of project management are your strengths?',
          required: true,
          options: ['Stakeholder Management', 'Team Leadership', 'Budget Management', 'Risk Management', 'Process Improvement']
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'Describe a challenging project you managed. How did you ensure success?',
          required: true,
          validation: { maxLength: 1500 }
        },
        {
          id: crypto.randomUUID(),
          type: 'long-text',
          text: 'How do you motivate teams and resolve conflicts?',
          required: true,
          validation: { maxLength: 1000 }
        }
      ]
    };

    const fallbackSpecific = [
      { id: crypto.randomUUID(), type: 'multi-choice', text: 'Which VCS and branching strategies have you used?', required: true, options: ['GitFlow', 'Trunk-Based', 'GitHub Flow', 'Release Branching'] },
      { id: crypto.randomUUID(), type: 'multi-choice', text: 'Which CI/CD tools have you configured?', required: true, options: ['GitHub Actions', 'GitLab CI', 'Jenkins', 'CircleCI', 'Azure DevOps'] },
      { id: crypto.randomUUID(), type: 'single-choice', text: 'Preferred package manager?', required: true, options: ['npm', 'yarn', 'pnpm'] },
      { id: crypto.randomUUID(), type: 'long-text', text: 'Describe your approach to code reviews and maintaining code quality.', required: true, validation: { maxLength: 1000 } },
      { id: crypto.randomUUID(), type: 'multi-choice', text: 'Which security best practices do you apply?', required: true, options: ['Dependency Scanning', 'Secrets Scanning', 'Static Analysis', 'Threat Modeling', 'OWASP Top 10 Awareness'] },
      { id: crypto.randomUUID(), type: 'long-text', text: 'Explain a time you improved performance or reduced costs significantly.', required: true, validation: { maxLength: 1000 } },
      { id: crypto.randomUUID(), type: 'multi-choice', text: 'Which testing levels are you comfortable with?', required: true, options: ['Unit', 'Integration', 'E2E', 'Contract', 'Performance'] },
      { id: crypto.randomUUID(), type: 'long-text', text: 'How do you document architecture and APIs effectively?', required: true, validation: { maxLength: 1000 } }
    ];

    const specificQuestions = jobSpecificQuestions[jobTitle] || fallbackSpecific;

    return [...generalQuestions, ...specificQuestions].slice(0, 10);
};

export const generateAssessments = (jobs) => {
  return jobs.map((job) => {
    const jobTitle = job.title || JOB_TITLES[0];

    return {
      jobId: job.id,
      sections: [
      {
        id: crypto.randomUUID(),
        title: 'Basic Information',
        description: 'Please provide your basic information and background.',
        questions: [
          {
            id: crypto.randomUUID(),
            type: 'short-text',
            text: 'What interests you most about this position?',
            required: true,
            validation: { maxLength: 200 }
          },
          {
            id: crypto.randomUUID(),
            type: 'long-text',
            text: 'Describe your most relevant work experience for this role.',
            required: true,
            validation: { maxLength: 1000 }
          }
        ]
      },
      {
        id: crypto.randomUUID(),
        title: 'Technical Assessment',
        description: 'Please complete this technical assessment to demonstrate your expertise.',
        questions: getTechnicalQuestions(jobTitle)  // Use the actual job title
      },
      {
        id: crypto.randomUUID(),
        title: 'Problem-Solving Skills',
        description: 'Demonstrate your approach to solving technical challenges.',
        questions: [
          {
            id: crypto.randomUUID(),
            type: 'long-text',
            text: 'Describe a complex technical problem you solved. What was your approach and what was the outcome?',
            required: true,
            validation: { maxLength: 1500 }
          },
          {
            id: crypto.randomUUID(),
            type: 'long-text',
            text: 'How do you approach learning new technologies? Give an example of a technology you recently learned.',
            required: true,
            validation: { maxLength: 1000 }
          },
          {
            id: crypto.randomUUID(),
            type: 'file-upload',
            text: 'Upload any relevant code samples or project documentation.',
            required: false
          }
        ]
      }
    ],
    updatedAt: new Date()
  };
});
};

export const generateCandidates = (jobIds) => {
  const stages = ['applied', 'screening', 'interview', 'offer', 'hired', 'rejected'];
  
  return Array.from({ length: 1000 }, (_, index) => {
    const jobId = faker.helpers.arrayElement(jobIds);
    const stage = faker.helpers.arrayElement(stages);
    const appliedDate = getRandomRecentDate();
    
    // Generate 1-5 notes for each candidate
    const notes = Array.from({ length: Math.floor(Math.random() * 5) + 1 }, () => ({
      text: faker.lorem.paragraph(),
      timestamp: new Date(appliedDate.getTime() + Math.random() * (Date.now() - appliedDate)),
      author: faker.person.fullName()
    }));

    return {
      id: String(index + 1),
      name: faker.person.fullName(),
      email: faker.internet.email(),
      phone: faker.phone.number(),
      location: faker.location.city(),
      stage,
      jobId,
      appliedDate,
      experience: Math.floor(Math.random() * 15),
      education: faker.helpers.arrayElement([
        "Bachelor's", "Master's", "PhD", "High School"
      ]),
      skills: getRandomItems(SKILLS, 2, 8),
      notes,
      lastUpdated: new Date()
    };
  });
};
