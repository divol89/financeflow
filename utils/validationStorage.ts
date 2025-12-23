// Validation Storage System for Project Documents
import {
  collection,
  doc,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { db, storage } from "../firebase/firebase";

export interface ProjectDocument {
  id: string;
  projectId: string;
  stepId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  downloadURL: string;
  uploadedAt: Timestamp;
  status: "pending" | "approved" | "rejected";
  reviewerNotes?: string;
  hash: string; // For integrity verification
}

export interface ValidationStep {
  id: string;
  projectId: string;
  stepName: string;
  status: "pending" | "in-progress" | "completed" | "rejected";
  requiredDocuments: string[];
  uploadedDocuments: string[];
  completionPercentage: number;
  lastUpdated: Timestamp;
  reviewerId?: string;
  notes?: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  ownerId: string;
  ownerEmail: string;
  status: "draft" | "submitted" | "under-review" | "approved" | "rejected";
  createdAt: Timestamp;
  updatedAt: Timestamp;
  validationSteps: ValidationStep[];
  totalScore: number;
  communityVotes: number;
  riskLevel: "low" | "medium" | "high";
  // Additional project metadata
  website?: string;
  category?: string;
  country?: string;
  teamSize?: string;
  fundingGoal?: string;
  expectedLaunch?: string;
  logoUrl?: string;
}

class ValidationStorage {
  private projectsCollection = "projects";
  private documentsCollection = "projectDocuments";
  private validationsCollection = "validationSteps";

  // Project Management
  async createProject(
    projectData: Omit<Project, "id" | "createdAt" | "updatedAt">
  ): Promise<string> {
    const projectRef = doc(collection(db, this.projectsCollection));
    const project: Project = {
      ...projectData,
      id: projectRef.id,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    };

    await setDoc(projectRef, project);
    return projectRef.id;
  }

  async getProject(projectId: string): Promise<Project | null> {
    const projectRef = doc(db, this.projectsCollection, projectId);
    const projectSnap = await getDoc(projectRef);

    if (projectSnap.exists()) {
      return projectSnap.data() as Project;
    }
    return null;
  }

  async updateProject(
    projectId: string,
    updates: Partial<Project>
  ): Promise<void> {
    const projectRef = doc(db, this.projectsCollection, projectId);
    await updateDoc(projectRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  async getAllProjects(): Promise<Project[]> {
    const projectsRef = collection(db, this.projectsCollection);
    const q = query(projectsRef, orderBy("createdAt", "desc"));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as Project);
  }

  // Document Management
  async uploadDocument(
    projectId: string,
    stepId: string,
    file: File,
    metadata: {
      fileName: string;
      fileType: string;
      fileSize: number;
      hash: string;
    }
  ): Promise<string> {
    // Upload file to Firebase Storage
    const fileRef = ref(
      storage,
      `projects/${projectId}/${stepId}/${metadata.fileName}`
    );
    const uploadResult = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);

    // Save document metadata to Firestore
    const docRef = doc(collection(db, this.documentsCollection));
    const document: ProjectDocument = {
      id: docRef.id,
      projectId,
      stepId,
      fileName: metadata.fileName,
      fileType: metadata.fileType,
      fileSize: metadata.fileSize,
      downloadURL,
      uploadedAt: Timestamp.now(),
      status: "pending",
      hash: metadata.hash,
    };

    await setDoc(docRef, document);
    return docRef.id;
  }

  async getProjectDocuments(projectId: string): Promise<ProjectDocument[]> {
    const documentsRef = collection(db, this.documentsCollection);
    const q = query(documentsRef, where("projectId", "==", projectId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as ProjectDocument);
  }

  async updateDocumentStatus(
    documentId: string,
    status: "pending" | "approved" | "rejected",
    reviewerNotes?: string
  ): Promise<void> {
    const docRef = doc(db, this.documentsCollection, documentId);
    await updateDoc(docRef, {
      status,
      reviewerNotes,
    });
  }

  async deleteDocument(documentId: string): Promise<void> {
    const docRef = doc(db, this.documentsCollection, documentId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const document = docSnap.data() as ProjectDocument;

      // Delete file from Storage
      const fileRef = ref(storage, document.downloadURL);
      await deleteObject(fileRef);

      // Delete document record
      await deleteDoc(docRef);
    }
  }

  // Validation Steps Management
  async createValidationSteps(projectId: string): Promise<void> {
    const steps = [
      {
        id: "list-assets",
        projectId,
        stepName: "List your assets",
        status: "pending" as const,
        requiredDocuments: [
          "Business registration certificate",
          "Financial statements (last 2 years)",
          "Technical whitepaper",
          "Legal compliance documents",
          "Team credentials and experience",
          "Market analysis and competition study",
          "Revenue model documentation",
          "Intellectual property documentation",
        ],
        uploadedDocuments: [],
        completionPercentage: 0,
        lastUpdated: Timestamp.now(),
      },
      {
        id: "gain-support",
        projectId,
        stepName: "Gain full support",
        status: "pending" as const,
        requiredDocuments: [
          "Monthly progress reports",
          "Community engagement metrics",
          "External audit reports",
          "Transparency in fund usage",
          "Regular communication with stakeholders",
          "Performance metrics and KPIs",
          "Risk assessment documentation",
          "Contingency plans",
        ],
        uploadedDocuments: [],
        completionPercentage: 0,
        lastUpdated: Timestamp.now(),
      },
      {
        id: "partner-deFi",
        projectId,
        stepName: "Partner with us",
        status: "pending" as const,
        requiredDocuments: [
          "Smart contract verification",
          "IOTA network integration",
          "DeFi compliance certification",
          "Security audit reports",
          "Tokenomics documentation",
          "Liquidity provision plan",
          "Governance mechanism",
          "Technical integration roadmap",
        ],
        uploadedDocuments: [],
        completionPercentage: 0,
        lastUpdated: Timestamp.now(),
      },
      {
        id: "global-expansion",
        projectId,
        stepName: "Global expansion",
        status: "pending" as const,
        requiredDocuments: [
          "International market strategy",
          "Regulatory compliance by country",
          "Strategic partnerships documentation",
          "Localization plans",
          "Cross-border payment solutions",
          "Multi-language support",
          "Cultural adaptation strategy",
          "Global team structure",
        ],
        uploadedDocuments: [],
        completionPercentage: 0,
        lastUpdated: Timestamp.now(),
      },
    ];

    for (const step of steps) {
      const stepRef = doc(collection(db, this.validationsCollection));
      await setDoc(stepRef, { ...step, id: stepRef.id });
    }
  }

  async getValidationSteps(projectId: string): Promise<ValidationStep[]> {
    const stepsRef = collection(db, this.validationsCollection);
    const q = query(stepsRef, where("projectId", "==", projectId));
    const querySnapshot = await getDocs(q);

    return querySnapshot.docs.map((doc) => doc.data() as ValidationStep);
  }

  async updateValidationStep(
    stepId: string,
    updates: Partial<ValidationStep>
  ): Promise<void> {
    const stepRef = doc(db, this.validationsCollection, stepId);
    await updateDoc(stepRef, {
      ...updates,
      lastUpdated: Timestamp.now(),
    });
  }

  // Utility Functions
  async calculateProjectScore(projectId: string): Promise<number> {
    const steps = await this.getValidationSteps(projectId);
    const totalSteps = steps.length;
    const completedSteps = steps.filter(
      (step) => step.status === "completed"
    ).length;

    return totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;
  }

  async getProjectProgress(projectId: string): Promise<{
    overallProgress: number;
    stepProgress: { [key: string]: number };
  }> {
    const steps = await this.getValidationSteps(projectId);
    const stepProgress: { [key: string]: number } = {};

    let totalProgress = 0;
    steps.forEach((step) => {
      stepProgress[step.id] = step.completionPercentage;
      totalProgress += step.completionPercentage;
    });

    const overallProgress = steps.length > 0 ? totalProgress / steps.length : 0;

    return { overallProgress, stepProgress };
  }

  // Logo Upload to Storage (separate from documents)
  async uploadLogoToStorage(file: File, projectName: string): Promise<string> {
    // Validate file
    if (
      !this.validateFileType(file, [
        "image/jpeg",
        "image/png",
        "image/svg+xml",
        "image/webp",
      ])
    ) {
      throw new Error(
        "Invalid logo file type. Please upload JPG, PNG, SVG, or WebP files."
      );
    }

    if (!this.validateFileSize(file, 5)) {
      // 5MB limit for logos
      throw new Error(
        "Logo file size too large. Please upload files smaller than 5MB."
      );
    }

    // Create a unique filename
    const timestamp = Date.now();
    const sanitizedProjectName = projectName.replace(/[^a-zA-Z0-9]/g, "_");
    const fileExtension = file.name.split(".").pop();
    const fileName = `logo_${sanitizedProjectName}_${timestamp}.${fileExtension}`;

    // Upload to Firebase Storage
    const fileRef = ref(storage, `project-logos/${fileName}`);
    const uploadResult = await uploadBytes(fileRef, file);
    const downloadURL = await getDownloadURL(uploadResult.ref);

    return downloadURL;
  }

  // File Hash Generation (for integrity verification)
  async generateFileHash(file: File): Promise<string> {
    const buffer = await file.arrayBuffer();
    const hashBuffer = await crypto.subtle.digest("SHA-256", buffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  }

  // File Type Validation
  validateFileType(file: File, allowedTypes: string[]): boolean {
    return allowedTypes.includes(file.type);
  }

  // File Size Validation
  validateFileSize(file: File, maxSizeMB: number): boolean {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    return file.size <= maxSizeBytes;
  }
}

export const validationStorage = new ValidationStorage();
export default validationStorage;
