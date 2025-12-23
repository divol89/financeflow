import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  FaEye,
  FaEdit,
  FaCalendarAlt,
  FaUsers,
  FaGlobe,
  FaDollarSign,
  FaChartLine,
} from "react-icons/fa";
import { validationStorage, Project } from "../utils/validationStorage";

interface ProjectListProps {
  onProjectSelect: (project: Project) => void;
}

const ProjectList: React.FC<ProjectListProps> = ({ onProjectSelect }) => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, []);

  const loadProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await validationStorage.getAllProjects();
      setProjects(projectsData);
    } catch (error) {
      console.error("Error loading projects:", error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "rejected":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      case "under-review":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "submitted":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  const getRiskColor = (riskLevel: string) => {
    switch (riskLevel) {
      case "low":
        return "bg-green-500/20 text-green-400";
      case "medium":
        return "bg-yellow-500/20 text-yellow-400";
      case "high":
        return "bg-red-500/20 text-red-400";
      default:
        return "bg-gray-500/20 text-gray-400";
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <p className="text-gray-400 ml-4">Loading projects...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">
            Registered Projects
          </h2>
          <p className="text-gray-400">
            Manage and track validation progress for all projects
          </p>
        </div>
      </div>

      {/* Projects Grid */}
      {projects.length === 0 ? (
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <FaChartLine className="text-6xl mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Projects Registered
              </h3>
              <p className="text-gray-500">
                No projects have been registered yet
              </p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="bg-gray-800/50 border-gray-700 hover:border-cyan-500/50 transition-all duration-300 h-full">
                <CardHeader className="pb-4">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
                        {project.logoUrl ? (
                          <img
                            src={project.logoUrl}
                            alt={`${project.name} logo`}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        ) : (
                          <span className="text-white font-bold text-lg">
                            {project.name.charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <div>
                        <CardTitle className="text-lg text-white line-clamp-1">
                          {project.name}
                        </CardTitle>
                        <p className="text-sm text-gray-400">
                          {project.category || "Uncategorized"}
                        </p>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        project.status
                      )}`}
                    >
                      {project.status}
                    </span>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-gray-300 text-sm line-clamp-2">
                    {project.description}
                  </p>

                  {/* Project Stats */}
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="flex items-center text-gray-400">
                      <FaChartLine className="mr-2 text-cyan-400" />
                      <span>Score: {project.totalScore.toFixed(1)}%</span>
                    </div>
                    <div className="flex items-center text-gray-400">
                      <FaUsers className="mr-2 text-green-400" />
                      <span>Votes: {project.communityVotes}</span>
                    </div>
                    {project.teamSize && (
                      <div className="flex items-center text-gray-400">
                        <FaUsers className="mr-2 text-blue-400" />
                        <span>{project.teamSize}</span>
                      </div>
                    )}
                    {project.country && (
                      <div className="flex items-center text-gray-400">
                        <FaGlobe className="mr-2 text-purple-400" />
                        <span>{project.country}</span>
                      </div>
                    )}
                  </div>

                  {/* Risk Level */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-400">Risk Level:</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getRiskColor(
                        project.riskLevel
                      )}`}
                    >
                      {project.riskLevel}
                    </span>
                  </div>

                  {/* Funding Goal */}
                  {project.fundingGoal && (
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaDollarSign className="mr-2 text-green-400" />
                      <span>
                        Goal: ${parseInt(project.fundingGoal).toLocaleString()}
                      </span>
                    </div>
                  )}

                  {/* Launch Date */}
                  {project.expectedLaunch && (
                    <div className="flex items-center text-gray-400 text-sm">
                      <FaCalendarAlt className="mr-2 text-orange-400" />
                      <span>
                        Launch:{" "}
                        {new Date(project.expectedLaunch).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex space-x-2 pt-4">
                    <Button
                      onClick={() => onProjectSelect(project)}
                      className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-sm"
                    >
                      <FaEye className="mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-gray-400 border-gray-600 hover:bg-gray-700"
                    >
                      <FaEdit />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProjectList;
