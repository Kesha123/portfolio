const header = {
  homepage: 'https://innokentii.eu',
  title: 'Software Engineer',
}

const about = {
  name: 'Innokentii Kozlov',
  role: 'Software Engineer',
  description: 'I am a Cloud Engineer with a strong background in software development. I have experience in building and maintaining cloud infrastructure, CI/CD pipelines, and monitoring systems. I am passionate about learning new technologies and solving complex problems.',
  resume: 'https://innokentii.eu/resume.pdf',
  social: {
    linkedin: 'https://www.linkedin.com/in/innokentii-kozlov/',
    github: 'https://github.com/Kesha123',
  },
}

const projects = [
  {
    name: 'Personal Portfolio',
    description:
      'Personal portfolio website built with React and Material UI.',
    stack: ['JavaScript', 'React', 'Material UI', 'HTML', 'CSS', 'Docker', 'Kubernetes'],
    sourceCode: 'https://github.com/Kesha123/portfolio',
    livePreview: 'https://innokentii.eu',
  },
  {
    name: 'Home Server',
    description:
      'Personal home server setup with Raspberry Pi',
    stack: ['Kubernetes', 'K3S','Pulumi'],
    sourceCode: 'https://github.com/Kesha123/home-server',
    livePreview: 'https://github.com/Kesha123/home-server',
  },
  {
    name: 'K3S Cluster on AWS',
    description:
      'K3S Kubernetes cluster deployment on AWS using Pulumi.',
    stack: ['TypeScript', 'AWS', 'Pulumi', 'K3S', 'Python', 'Bash', 'Kubernetes'],
    sourceCode: 'https://github.com/Kesha123/k3s-aws',
    livePreview: 'https://github.com/Kesha123/k3s-aws',
  },
  {
    name: 'REST API with Node.js and Express.js',
    description:
      'Node.js + Express.js REST API, which provides CRUD operations on a table in SQLite3.',
    stack: ['NodeJs', 'Express.js', 'SQLite3', 'JavaScript', 'Docker', 'Kubernetes', 'Pulumi'],
    sourceCode: 'https://github.com/Kesha123/nodejs-rest-api',
    livePreview: 'https://nodejs-rest-api.innokentii.fi',
  },
  {
    name: 'Wolt delivery cost calculator API',
    description:
      'This application is needed when a customer is ready with their shopping cart and they\' like to see how much the delivery will cost. The delivery price depends on the cart value, the number of items in the cart, the time of the order, and the delivery distance.',
    stack: ['Python', 'Pytest', 'Docker', 'Kubernetes', 'Pulumi'],
    sourceCode: 'https://github.com/Kesha123/wolt-internship-backend',
    livePreview: 'https://wolt-delivery-cost-calculator.innokentii.fi',
  },
]

const skills = [
'Python',
'NodeJS',
'JavaScript',
'TypeScript',
'Git',
'Github',
'Github Actions',
'CI/CD',
'Docker',
'Kubernetes',
'Testing',
'Monitoring',
'Linux',
'DigitalOcean',
'AWS',
'Cloud Technologies',
'Nginx',
'SQL',
'PostgreSQL',
'Websockets',
'API',
'Rest API',
'IAC',
'Pulumi',
]

const contact = {
  email: 'innokentiikozlov@mail.com',
}

export { header, about, projects, skills, contact }
