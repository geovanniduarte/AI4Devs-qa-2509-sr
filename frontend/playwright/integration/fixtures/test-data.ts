/**
 * Interfaces y datos de prueba para tests E2E
 * Centraliza los datos mock para mantener consistencia
 */

/**
 * Estructura de datos para un candidato
 */
export interface CandidateData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  education?: {
    institution: string;
    title: string;
    startDate: string;
    endDate: string;
  };
  workExperience?: {
    company: string;
    position: string;
    description: string;
    startDate: string;
    endDate: string;
  };
  cvPath?: string;
}

/**
 * Candidatos de prueba predefinidos
 * Usar estos objetos en los tests para mantener consistencia
 */
export const testCandidates: Record<string, CandidateData> = {
  /**
   * Candidato con todos los campos completos
   * Útil para probar flujo completo con educación, experiencia y CV
   */
  validCandidate: {
    firstName: 'Juan',
    lastName: 'Pérez García',
    email: 'juan.perez@example.com',
    phone: '+34 612 345 678',
    address: 'Calle Mayor 123, 28013 Madrid',
    education: {
      institution: 'Universidad Complutense de Madrid',
      title: 'Ingeniería Informática',
      startDate: '2015-09-01',
      endDate: '2019-06-30'
    },
    workExperience: {
      company: 'Tech Solutions SL',
      position: 'Full Stack Developer',
      description: 'Desarrollo de aplicaciones web con React y Node.js',
      startDate: '2019-07-01',
      endDate: '2023-12-31'
    },
    cvPath: './playwright/integration/fixtures/files/sample-cv.pdf'
  },
  
  /**
   * Candidato con solo campos obligatorios
   * Útil para probar el mínimo de información requerida
   */
  minimalCandidate: {
    firstName: 'María',
    lastName: 'González',
    email: 'maria.gonzalez@example.com',
    phone: '+34 687 654 321',
    address: 'Avenida Libertad 45, 28001 Madrid'
  },
  
  /**
   * Candidato senior con experiencia extensa
   * Útil para probar múltiples experiencias laborales
   */
  seniorCandidate: {
    firstName: 'Carlos',
    lastName: 'Rodríguez López',
    email: 'carlos.rodriguez@example.com',
    phone: '+34 699 111 222',
    address: 'Plaza España 7, 28008 Madrid',
    education: {
      institution: 'Universidad Politécnica de Madrid',
      title: 'Máster en Ingeniería del Software',
      startDate: '2010-09-01',
      endDate: '2012-06-30'
    },
    workExperience: {
      company: 'Enterprise Corp',
      position: 'Senior Software Architect',
      description: 'Diseño y arquitectura de sistemas distribuidos',
      startDate: '2012-07-01',
      endDate: '2024-01-15'
    }
  },

  /**
   * Candidato junior recién graduado
   * Sin experiencia laboral, solo educación
   */
  juniorCandidate: {
    firstName: 'Ana',
    lastName: 'Martínez Silva',
    email: 'ana.martinez@example.com',
    phone: '+34 611 222 333',
    address: 'Calle Serrano 50, 28006 Madrid',
    education: {
      institution: 'Universidad de Barcelona',
      title: 'Grado en Ingeniería Informática',
      startDate: '2018-09-01',
      endDate: '2022-06-30'
    }
  },

  /**
   * Candidato con datos inválidos para pruebas de validación
   */
  invalidCandidate: {
    firstName: '',
    lastName: '',
    email: 'invalid-email',
    phone: '123',
    address: ''
  }
};

/**
 * Nombres de posiciones existentes en el sistema
 * Usar estas constantes para mantener consistencia en los tests
 */
export const testPositions = {
  seniorFullStack: 'Senior Full-Stack Engineer',
  juniorFrontend: 'Junior Frontend Developer',
  dataScientist: 'Data Scientist',
  backendEngineer: 'Backend Engineer',
  devOpsEngineer: 'DevOps Engineer'
};

/**
 * Estados posibles de una posición
 */
export const positionStatuses = {
  open: 'Open',
  closed: 'Cerrado',
  hired: 'Contratado',
  draft: 'Borrador'
};

/**
 * URLs comunes usadas en los tests
 */
export const testUrls = {
  dashboard: '/',
  addCandidate: '/add-candidate',
  positions: '/positions',
  candidates: '/candidates'
};

/**
 * Mensajes de éxito/error esperados
 */
export const testMessages = {
  candidateCreated: 'Candidato creado exitosamente',
  candidateUpdated: 'Candidato actualizado exitosamente',
  formValidationError: 'Por favor, complete todos los campos requeridos',
  networkError: 'Error de conexión. Por favor, intente nuevamente'
};

/**
 * Experiencias laborales adicionales para tests de múltiples experiencias
 */
export const additionalWorkExperiences = [
  {
    company: 'Startup Tech',
    position: 'Junior Developer',
    description: 'Desarrollo frontend con React',
    startDate: '2015-01-01',
    endDate: '2017-12-31'
  },
  {
    company: 'Consulting Firm',
    position: 'Mid-Level Developer',
    description: 'Desarrollo fullstack para clientes corporativos',
    startDate: '2018-01-01',
    endDate: '2020-12-31'
  }
];

/**
 * Educaciones adicionales para tests
 */
export const additionalEducations = [
  {
    institution: 'Online Academy',
    title: 'Certificación en Cloud Computing',
    startDate: '2022-01-01',
    endDate: '2022-06-30'
  },
  {
    institution: 'Tech Bootcamp',
    title: 'Full Stack Web Development',
    startDate: '2023-01-01',
    endDate: '2023-04-30'
  }
];

