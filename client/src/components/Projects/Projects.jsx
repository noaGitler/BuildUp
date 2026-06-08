import React from 'react';
import { Outlet } from 'react-router-dom';
import { ProjectProvider } from '../../context/ProjectContext';

const Projects = () => {
    return (
        <ProjectProvider>
            <Outlet />
        </ProjectProvider>
    );
};

export default Projects;