import uniqid from 'uniqid'
import ProjectContainer from '../ProjectContainer/ProjectContainer'
import './Projects.css'
import { useEffect, useState } from 'react'

const Projects = () => {

  const [projects, setProjects] = useState([]);

  useEffect(() => {
    async function fetchProjects() {
      const response = await fetch(
        'https://ekxu5fuoi1.execute-api.eu-north-1.amazonaws.com/production/github',
        {
          method: 'GET',
          headers: {
            'Authorization': 'secret-token',
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
