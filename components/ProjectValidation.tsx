import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { validationStorage, Project } from "../utils/validationStorage";
import ProjectList from "./ProjectList";
import ProjectDetails from "./ProjectDetails";
import TestFirebaseStorage from "./TestFirebaseStorage";

const ProjectValidation = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "details">("list");

  const loadProjects = useCallback(async () => {
    try {
      const projectsData = await validationStorage.getAllProjects();
      if (projectsData.length > 0 && !selectedProject) {
        setSelectedProject(projectsData[0]);
      }
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  }, [selectedProject]);

  useEffect(() => {
    if (viewMode === "list") {
      loadProjects();
    }
  }, [viewMode, loadProjects]);

  const handleProjectSelect = (project: Project) => {
    setSelectedProject(project);
    setViewMode("details");
  };

  const handleBackToList = () => {
    setViewMode("list");
    setSelectedProject(null);
  };

  if (viewMode === "details" && selectedProject) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white p-8">
        <div className="max-w-7xl mx-auto">
          <ProjectDetails project={selectedProject} onBack={handleBackToList} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent mb-4">
            Project Validation System
          </h1>
          <p className="text-xl text-gray-300">
            Validate your project and gain community trust through our
            comprehensive verification process
          </p>
        </motion.div>

        <ProjectList onProjectSelect={handleProjectSelect} />

        {/* Temporary test component */}
        <div className="mt-8">
          <TestFirebaseStorage />
        </div>
      </div>
    </div>
  );
};

export default ProjectValidation;
