"use client";  
import { Project as ProjectType } from "../data/project";
import { useState, useEffect, useRef, forwardRef } from "react";
import Image, { ImageLoaderProps } from 'next/image';
import { FaChevronDown } from 'react-icons/fa';
import { TailSpin } from 'react-loader-spinner';
import { CSSTransition } from 'react-transition-group';
import './Project.css';

interface ProjectProps {
  project: ProjectType;
  isExpanded: boolean;
  onClick: () => void;
}

const getGridCols = (count: number): number => {
  if (count >= 4) return 4;
  if (count === 3) return 3;
  if (count === 2) return 2;
  return 1; 
};

const imageLoader = ({ src, width, quality }: ImageLoaderProps): string => {
  return `/halcyonashes/images/${src}?w=${width}&q=${quality || 75}`;
};

const Project = forwardRef<HTMLDivElement, ProjectProps>(({ project, isExpanded, onClick }, ref) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [localState, setLocalState] = useState<boolean>(false);

  // Control scroll behavior when expanding only
  useEffect(() => {
    if (isExpanded && containerRef.current) {
      const timeoutId = setTimeout(() => {
        containerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350); 
      return () => clearTimeout(timeoutId); // Cleanup the timeout
    }
  }, [isExpanded]);

  return (
    <div
      className="border p-3 rounded-lg cursor-pointer transition-shadow duration-300 ease-in-out transform hover:shadow-lg"
      onClick={onClick}
      ref={containerRef} // Attach container ref for scroll control
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{project.title}</h3>
        <FaChevronDown className="text-lg" />
      </div>
      <CSSTransition
        in={isExpanded}
        timeout={300}
        classNames="expand"
        unmountOnExit
      >
        <div className="mt-4">
          <p className="font-normal">{project.description}</p>
          <div
            className="mt-4 grid gap-4"
            style={{ gridTemplateColumns: `repeat(${getGridCols(project.screenshots.length)}, minmax(0, 1fr))` }}
          >
            {project.screenshots.map((screenshot: string, index: number) => (
              screenshot ? (
                <ImageWithSpinner key={index} src={screenshot} index={index} />
              ) : (
                <div
                  key={index}
                  className="relative"
                  style={{ height: 'auto' }}
                />
              )
            ))}
          </div>
        </div>
      </CSSTransition>
    </div>
  );
});

Project.displayName = 'Project';

const ImageWithSpinner = ({ src, index }: { src: string; index: number }) => {
  const [loading, setLoading] = useState(true);

  return (
    <div
      className="relative overflow-hidden rounded-lg border border-gray-100"
      style={{ height: 'auto' }}
    >
      {loading && (
        <div className="flex justify-center items-center h-full">
          <TailSpin
            height="80"
            width="80"
            color="#4fa94d"
            ariaLabel="loading"
          />
        </div>
      )}
      <Image
        src={src}
        alt={`Screenshot ${index + 1}`}
        layout="responsive"
        width={300}
        height={400}
        objectFit="cover"
        loading="lazy"
        onLoadingComplete={() => setLoading(false)}
      />
    </div>
  );
};

export default Project;
