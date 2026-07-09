import React, { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FaArrowLeft,
  FaUpload,
  FaEye,
  FaCheckCircle,
  FaTimesCircle,
  FaClock,
  FaFileAlt,
  FaChartLine,
  FaUsers,
  FaGlobe,
  FaDollarSign,
  FaCalendarAlt,
  FaShieldAlt,
  FaHandshake,
  FaRocket,
} from "react-icons/fa";
import {
  validationStorage,
  Project,
  ValidationStep,
  ProjectDocument,
} from "../utils/validationStorage";

interface ProjectDetailsProps {
  project: Project;
  onBack: () => void;
}

const ProjectDetails: React.FC<ProjectDetailsProps> = ({ project, onBack }) => {
  const [validationSteps, setValidationSteps] = useState<ValidationStep[]>([]);
  const [documents, setDocuments] = useState<ProjectDocument[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  const loadProjectData = useCallback(async () => {
    try {
      setLoading(true);
      const [steps, docs] = await Promise.all([
        validationStorage.getValidationSteps(project.id),
        validationStorage.getProjectDocuments(project.id),
      ]);
      setValidationSteps(steps);
      setDocuments(docs);
    } catch (error) {
      console.error("Error loading project data:", error);
    } finally {
      setLoading(false);
    }
  }, [project.id]);

  useEffect(() => {
    loadProjectData();
  }, [loadProjectData]);

  const handleFileUpload = async (stepId: string, file: File) => {
    try {
      const allowedTypes = [
        "application/pdf",
        "image/jpeg",
        "image/png",
        "application/msword",
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      ];

      if (!validationStorage.validateFileType(file, allowedTypes)) {
        alert(
          "Invalid file type. Please upload PDF, DOC, DOCX, JPG, or PNG files."
        );
        return;
      }

      if (!validationStorage.validateFileSize(file, 10)) {
        alert("File size too large. Please upload files smaller than 10MB.");
        return;
      }

      const hash = await validationStorage.generateFileHash(file);

      await validationStorage.uploadDocument(project.id, stepId, file, {
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        hash,
      });

      await loadProjectData();
      alert("Document uploaded successfully!");
    } catch (error) {
      console.error("Error uploading document:", error);
      alert("Error uploading document. Please try again.");
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <FaCheckCircle className="text-green-500" />;
      case "rejected":
        return <FaTimesCircle className="text-red-500" />;
      case "in-progress":
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaClock className="text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-500/10";
      case "rejected":
        return "border-red-500 bg-red-500/10";
      case "in-progress":
        return "border-yellow-500 bg-yellow-500/10";
      default:
        return "border-gray-500 bg-gray-500/10";
    }
  };

  const validationStepsUI = [
    {
      id: "list-assets",
      title: "List your assets",
      description: "Document your project assets and provide transparency",
      icon: <FaFileAlt className="text-4xl text-blue-400" />,
      requirements: [
        "Business registration certificate",
        "Financial statements (last 2 years)",
        "Technical whitepaper",
        "Legal compliance documents",
        "Team credentials and experience",
        "Market analysis and competition study",
        "Revenue model documentation",
        "Intellectual property documentation",
      ],
    },
    {
      id: "gain-support",
      title: "Gain full support",
      description:
        "Build community trust through transparency and regular updates",
      icon: <FaHandshake className="text-4xl text-green-400" />,
      requirements: [
        "Monthly progress reports",
        "Community engagement metrics",
        "External audit reports",
        "Transparency in fund usage",
        "Regular communication with stakeholders",
        "Performance metrics and KPIs",
        "Risk assessment documentation",
        "Contingency plans",
      ],
    },
    {
      id: "partner-deFi",
      title: "Partner with us",
      description: "Integrate with IOTA DeFi ecosystem",
      icon: <FaShieldAlt className="text-4xl text-purple-400" />,
      requirements: [
        "Smart contract verification",
        "IOTA network integration",
        "DeFi compliance certification",
        "Security audit reports",
        "Tokenomics documentation",
        "Liquidity provision plan",
        "Governance mechanism",
        "Technical integration roadmap",
      ],
    },
    {
      id: "global-expansion",
      title: "Global expansion",
      description: "Scale your project worldwide with proper documentation",
      icon: <FaRocket className="text-4xl text-pink-400" />,
      requirements: [
        "International market strategy",
        "Regulatory compliance by country",
        "Strategic partnerships documentation",
        "Localization plans",
        "Cross-border payment solutions",
        "Multi-language support",
        "Cultural adaptation strategy",
        "Global team structure",
      ],
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-500"></div>
        <p className="text-gray-400 ml-4">Loading project details...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            onClick={onBack}
            variant="outline"
            className="text-gray-400 border-gray-600 hover:bg-gray-700"
          >
            <FaArrowLeft className="mr-2" />
            Back to Projects
          </Button>
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center">
              {project.logoUrl ? (
                <img
                  src={project.logoUrl}
                  alt={`${project.name} logo`}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <span className="text-white font-bold text-2xl">
                  {project.name.charAt(0).toUpperCase()}
                </span>
              )}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">{project.name}</h1>
              <p className="text-gray-400">
                {project.category || "Uncategorized"}
              </p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-cyan-400">
            {project.totalScore.toFixed(1)}%
          </div>
          <div className="text-sm text-gray-400">Overall Score</div>
        </div>
      </div>

      {/* Project Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <FaUsers className="text-2xl text-blue-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {project.communityVotes}
            </div>
            <div className="text-sm text-gray-400">Community Votes</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <FaChartLine className="text-2xl text-green-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {validationSteps.filter((s) => s.status === "completed").length}/
              {validationSteps.length}
            </div>
            <div className="text-sm text-gray-400">Steps Completed</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <FaFileAlt className="text-2xl text-purple-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white">
              {documents.length}
            </div>
            <div className="text-sm text-gray-400">Documents Uploaded</div>
          </CardContent>
        </Card>
        <Card className="bg-gray-800/50 border-gray-700">
          <CardContent className="p-4 text-center">
            <FaShieldAlt className="text-2xl text-orange-400 mx-auto mb-2" />
            <div className="text-lg font-bold text-white capitalize">
              {project.riskLevel}
            </div>
            <div className="text-sm text-gray-400">Risk Level</div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-1 mb-8 lg:grid-cols-4 rounded-xl p-1">
          <TabsTrigger value="overview" className="text-lg font-semibold">
            Overview
          </TabsTrigger>
          <TabsTrigger value="validation" className="text-lg font-semibold">
            Validation Steps
          </TabsTrigger>
          <TabsTrigger value="documents" className="text-lg font-semibold">
            Documents
          </TabsTrigger>
          <TabsTrigger value="progress" className="text-lg font-semibold">
            Progress
          </TabsTrigger>
        </TabsList>

        <TabsContent value="overview">
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-300">
                  Project Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-400">
                    Description
                  </label>
                  <p className="text-gray-300 mt-1">{project.description}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-400">
                      Owner Email
                    </label>
                    <p className="text-gray-300">{project.ownerEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400">
                      Status
                    </label>
                    <p className="text-gray-300 capitalize">{project.status}</p>
                  </div>
                </div>
                {project.website && (
                  <div>
                    <label className="text-sm font-medium text-gray-400">
                      Website
                    </label>
                    <a
                      href={project.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-cyan-400 hover:text-cyan-300"
                    >
                      {project.website}
                    </a>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-gray-800/50 border-gray-700">
              <CardHeader>
                <CardTitle className="text-xl text-cyan-300">
                  Project Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {project.country && (
                  <div className="flex items-center text-gray-300">
                    <FaGlobe className="mr-3 text-blue-400" />
                    <span>{project.country}</span>
                  </div>
                )}
                {project.teamSize && (
                  <div className="flex items-center text-gray-300">
                    <FaUsers className="mr-3 text-green-400" />
                    <span>{project.teamSize}</span>
                  </div>
                )}
                {project.fundingGoal && (
                  <div className="flex items-center text-gray-300">
                    <FaDollarSign className="mr-3 text-yellow-400" />
                    <span>
                      ${parseInt(project.fundingGoal).toLocaleString()}
                    </span>
                  </div>
                )}
                {project.expectedLaunch && (
                  <div className="flex items-center text-gray-300">
                    <FaCalendarAlt className="mr-3 text-purple-400" />
                    <span>
                      {new Date(project.expectedLaunch).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="validation">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {validationStepsUI.map((step) => {
              const dbStep = validationSteps.find((s) => s.id === step.id);
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <Card
                    className={`h-full border-2 ${getStatusColor(
                      dbStep?.status || "pending"
                    )} hover:shadow-lg transition-all duration-300`}
                  >
                    <CardContent className="p-6 text-center">
                      <div className="mb-4 flex justify-center">
                        {step.icon}
                      </div>
                      <div className="flex items-center justify-center mb-2">
                        {getStatusIcon(dbStep?.status || "pending")}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-3">
                        {step.title}
                      </h3>
                      <p className="text-gray-400 text-sm leading-relaxed mb-4">
                        {step.description}
                      </p>
                      <div className="text-xs text-gray-500 mb-2">
                        {step.requirements.length} requirements
                      </div>
                      {dbStep && (
                        <div className="text-xs text-blue-400">
                          Progress: {dbStep.completionPercentage}%
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-6">
            {validationStepsUI.map((step) => (
              <Card key={step.id} className="bg-gray-800/50 border-gray-700">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {step.icon}
                      <div>
                        <CardTitle className="text-xl text-white">
                          {step.title}
                        </CardTitle>
                        <p className="text-gray-400 text-sm">
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <input
                        type="file"
                        id={`file-upload-${step.id}`}
                        className="hidden"
                        multiple
                        accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                        onChange={(e) => {
                          if (e.target.files) {
                            Array.from(e.target.files).forEach((file) => {
                              handleFileUpload(step.id, file);
                            });
                          }
                        }}
                      />
                      <Button
                        className="bg-blue-600 hover:bg-blue-700"
                        onClick={() =>
                          document
                            .getElementById(`file-upload-${step.id}`)
                            ?.click()
                        }
                      >
                        <FaUpload className="mr-2" />
                        Upload
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-2 mb-4">
                    {step.requirements.map((requirement) => (
                      <div
                        key={requirement}
                        className="flex items-center text-gray-300"
                      >
                        <FaCheckCircle className="text-green-500 mr-2 text-sm" />
                        {requirement}
                      </div>
                    ))}
                  </div>

                  {/* Show uploaded documents for this step */}
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-400 mb-2">
                      Uploaded Documents:
                    </h4>
                    {documents.filter((doc) => doc.stepId === step.id).length >
                    0 ? (
                      <div className="space-y-2">
                        {documents
                          .filter((doc) => doc.stepId === step.id)
                          .map((doc) => (
                            <div
                              key={doc.id}
                              className="flex items-center justify-between bg-gray-700/50 rounded-lg p-3"
                            >
                              <div className="flex items-center space-x-3">
                                <FaFileAlt className="text-blue-400" />
                                <div>
                                  <p className="text-white text-sm">
                                    {doc.fileName}
                                  </p>
                                  <p className="text-gray-400 text-xs">
                                    {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs ${
                                    doc.status === "approved"
                                      ? "bg-green-500/20 text-green-400"
                                      : doc.status === "rejected"
                                      ? "bg-red-500/20 text-red-400"
                                      : "bg-yellow-500/20 text-yellow-400"
                                  }`}
                                >
                                  {doc.status}
                                </span>
                                <Button size="sm" variant="outline">
                                  <FaEye />
                                </Button>
                              </div>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-sm">
                        No documents uploaded yet
                      </p>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="progress">
          <div className="space-y-6">
            {validationStepsUI.map((step) => {
              const dbStep = validationSteps.find((s) => s.id === step.id);
              return (
                <Card key={step.id} className="bg-gray-800/50 border-gray-700">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        {step.icon}
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {step.title}
                          </h3>
                          <p className="text-gray-400">{step.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(dbStep?.status || "pending")}
                        <span className="capitalize text-white">
                          {dbStep?.status || "pending"}
                        </span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-700 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all duration-500 ${
                          dbStep?.status === "completed"
                            ? "bg-green-500"
                            : dbStep?.status === "in-progress"
                            ? "bg-yellow-500"
                            : dbStep?.status === "rejected"
                            ? "bg-red-500"
                            : "bg-gray-500"
                        }`}
                        style={{
                          width: `${dbStep?.completionPercentage || 0}%`,
                        }}
                      ></div>
                    </div>
                    <div className="flex justify-between text-sm text-gray-400 mt-2">
                      <span>
                        Progress: {dbStep?.completionPercentage || 0}%
                      </span>
                      <span>
                        {
                          documents.filter((doc) => doc.stepId === step.id)
                            .length
                        }{" "}
                        documents
                      </span>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProjectDetails;
