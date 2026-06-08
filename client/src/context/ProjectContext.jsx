import React, { createContext, useContext, useState, useCallback } from 'react';
import projectService from '../services/projectService';

const ProjectContext = createContext(null);

export const ProjectProvider = ({ children }) => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // Fetches projects from the server.
    const fetchProjects = useCallback(async (filters = {}) => {
        setLoading(true);
        setError(null);
        try {
            // Passing the active URL parameters block down to axios
            const result = await projectService.getProjectsFiles(filters);

            if (result.success) {
                setProjects(result.data);
            } else {
                setError(result.message || "Failed to compile project catalog.");
            }
        } catch (err) {
            console.error("Error inside ProjectProvider fetch sequence:", err);
            setError(err.response?.data?.message || "Internal server error occurred.");
        } finally {
            setLoading(false);
        }
    }, []);

    // Create Project Trigger Call
    const createProject = useCallback(async (projectPayload) => {
        setLoading(true);
        setError(null);
        try {
            const result = await projectService.createProject(projectPayload);
            if (result.success) {
                // Optimistically update local array states tracking lists
                setProjects(prev => [result.data, ...prev]);
                return { success: true, data: result.data };
            } else {
                setError(result.message || "Failed to create new project asset.");
                return { success: false, message: result.message };
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Internal server setup tracking error.";
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    // Update Project Specification Modification Call
    const updateProject = useCallback(async (id, updatePayload) => {
        setLoading(true);
        setError(null);
        try {
            const result = await projectService.updateProject(id, updatePayload);
            if (result.success) {
                setProjects(prev => prev.map(p => p.id === id ? result.data : p));
                return { success: true, data: result.data };
            } else {
                setError(result.message || "Failed to finalize specifications updates.");
                return { success: false, message: result.message };
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Internal database sync error modifications.";
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    // Deleting an existing project
    const deleteProject = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const result = await projectService.deleteProject(id);
            if (result.success) {
                setProjects(prev => prev.filter(p => p.id !== Number(id)));
                return { success: true };
            } else {
                setError(result.message || "Failed to remove project asset.");
                return { success: false, message: result.message };
            }
        } catch (err) {
            const msg = err.response?.data?.message || "Internal server error during delete sync.";
            setError(msg);
            return { success: false, message: msg };
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <ProjectContext.Provider
            value={{
                projects,
                loading,
                error,
                fetchProjects,
                createProject,
                updateProject,
                deleteProject
            }}>
            {children}
        </ProjectContext.Provider>
    );
};

export const useProjects = () => {
    const context = useContext(ProjectContext);
    if (!context) {
        throw new Error("useProjects must be used within a ProjectProvider");
    }
    return context;
};