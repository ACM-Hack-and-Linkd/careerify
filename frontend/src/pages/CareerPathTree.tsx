// src/CareerPathGraph.tsx

import React from 'react';
import styled from 'styled-components';

interface CareerNode {
  id: string;
  name: string;
  level: number;
  description: string;
}

interface CareerLink {
  source: string;
  target: string;
}

interface GraphData {
  nodes: CareerNode[];
  links: CareerLink[];
}

const careerPathData: GraphData = {
  nodes: [
    { 
      id: 'cs_student', 
      name: 'CS Student', 
      level: 0,
      description: 'Starting point for a career in technology. Focus on computer science fundamentals, programming, and problem-solving skills.'
    },
    { 
      id: 'swe', 
      name: 'Software Engineer', 
      level: 1,
      description: 'Design, develop, and maintain software applications. Write clean, efficient code and collaborate with cross-functional teams.'
    },
    { 
      id: 'pm', 
      name: 'Product Manager', 
      level: 1,
      description: 'Lead product development, define features, and work with engineering teams to deliver successful products.'
    },
    { 
      id: 'ds', 
      name: 'Data Scientist', 
      level: 1,
      description: 'Analyze complex data sets, build predictive models, and derive insights to drive business decisions.'
    },
    { 
      id: 'senior_swe', 
      name: 'Senior SWE', 
      level: 2,
      description: 'Lead technical projects, mentor junior engineers, and make architectural decisions.'
    },
    { 
      id: 'tech_lead', 
      name: 'Tech Lead', 
      level: 2,
      description: 'Guide technical direction, lead engineering teams, and ensure high-quality software delivery.'
    },
    { 
      id: 'senior_pm', 
      name: 'Senior PM', 
      level: 2,
      description: 'Manage complex product initiatives, lead product strategy, and drive cross-functional alignment.'
    },
    { 
      id: 'product_director', 
      name: 'Product Director', 
      level: 2,
      description: 'Define product vision, lead multiple product teams, and drive business growth through product strategy.'
    },
    { 
      id: 'senior_ds', 
      name: 'Senior DS', 
      level: 2,
      description: 'Lead data science initiatives, develop advanced models, and drive data-driven decision making.'
    },
    { 
      id: 'ml_engineer', 
      name: 'ML Engineer', 
      level: 2,
      description: 'Build and deploy machine learning models, optimize algorithms, and create scalable ML systems.'
    },
    { 
      id: 'staff_swe', 
      name: 'Staff SWE', 
      level: 3,
      description: 'Set technical standards, drive innovation, and solve complex technical challenges across the organization.'
    },
    { 
      id: 'engineering_manager', 
      name: 'Engineering Manager', 
      level: 3,
      description: 'Lead engineering teams, manage technical projects, and drive engineering excellence.'
    },
    { 
      id: 'product_vp', 
      name: 'Product VP', 
      level: 3,
      description: 'Lead product organization, define company-wide product strategy, and drive business growth.'
    },
    { 
      id: 'data_science_manager', 
      name: 'Data Science Manager', 
      level: 3,
      description: 'Lead data science teams, drive data strategy, and ensure data-driven decision making across the organization.'
    },
  ],
  links: [
    { source: 'cs_student', target: 'swe' },
    { source: 'cs_student', target: 'pm' },
    { source: 'cs_student', target: 'ds' },
    { source: 'swe', target: 'senior_swe' },
    { source: 'swe', target: 'tech_lead' },
    { source: 'pm', target: 'senior_pm' },
    { source: 'pm', target: 'product_director' },
    { source: 'ds', target: 'senior_ds' },
    { source: 'ds', target: 'ml_engineer' },
    { source: 'senior_swe', target: 'staff_swe' },
    { source: 'tech_lead', target: 'engineering_manager' },
    { source: 'product_director', target: 'product_vp' },
    { source: 'senior_ds', target: 'data_science_manager' },
  ],
};

const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  overflow-x: auto;
`;

const Title = styled.h1`
  color: #FF9000;
  margin-bottom: 20px;
  font-size: 2rem;
`;

const TreeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  min-width: 100%;
`;

const Level = styled.div`
  display: flex;
  justify-content: center;
  gap: 40px;
  margin: 20px 0;
  position: relative;
  min-width: 100%;
`;

const NodeWrapper = styled.div`
  position: relative;
`;

const Node = styled.div<{ isRoot?: boolean }>`
  background-color: ${props => props.isRoot ? '#FF9000' : '#ffffff'};
  color: ${props => props.isRoot ? '#ffffff' : '#FF9000'};
  padding: 12px 24px;
  border: 3px solid #FF9000;
  border-radius: 16px;
  font-weight: 500;
  position: relative;
  min-width: 140px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
`;

const Tooltip = styled.div`
  position: absolute;
  bottom: 100%;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 12px;
  border-radius: 8px;
  font-size: 14px;
  width: 250px;
  margin-bottom: 10px;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 1000;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &::after {
    content: '';
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translateX(-50%);
    border-width: 6px;
    border-style: solid;
    border-color: #333 transparent transparent transparent;
  }

  ${NodeWrapper}:hover & {
    opacity: 1;
    visibility: visible;
    transform: translateX(-50%) translateY(-5px);
  }
`;

const CareerPathTree: React.FC = () => {
  // Group nodes by level
  const nodesByLevel = careerPathData.nodes.reduce((acc, node) => {
    if (!acc[node.level]) {
      acc[node.level] = [];
    }
    acc[node.level].push(node);
    return acc;
  }, {} as Record<number, CareerNode[]>);

  // Sort levels
  const levels = Object.keys(nodesByLevel)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <Container>
      <Title>Career Path Tree</Title>
      <TreeContainer>
        {levels.map((level) => (
          <Level key={level}>
            {nodesByLevel[level].map((node) => (
              <NodeWrapper key={node.id}>
                <Node isRoot={level === 0}>
                  {node.name}
                </Node>
                <Tooltip>
                  {node.description}
                </Tooltip>
              </NodeWrapper>
            ))}
          </Level>
        ))}
      </TreeContainer>
    </Container>
  );
};

export default CareerPathTree;