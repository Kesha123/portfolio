import uniqid from 'uniqid'
import ProjectContainer from '../ProjectContainer/ProjectContainer'
import './Projects.css'
import { useEffect, useState } from 'react'

const Projects = () => {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch(
        'https://faas-ams3-2a2df116.doserverless.co/api/v1/web/fn-b23b500e-c8e1-45af-b470-c4a00bfa0af8/portfolio/projects',
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'X-Require-Whisk-Auth': 'Hi7R7uDn5BtmNgN'
          }
        }
      )
      const data = await response.json()
      setProjects(data)
    }
    fetchProjects();
  });

  return (
    <section id='projects' className='section projects'>
      <h2 className='section__title'>Projects</h2>

      <div className='projects__grid'>
        {projects.map((project) => (
          <ProjectContainer key={uniqid()} project={project} />
        ))}
      </div>
    </section>
  )
}

export default Projects
