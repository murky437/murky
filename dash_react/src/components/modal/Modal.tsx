import { type ReactNode, useEffect, useRef } from 'react';
import styles from './Modal.module.css';

interface Props {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ title, onClose, children }: Props) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      ref.current && !ref.current.contains(e.target as Node) && onClose();
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  return (
    <div className={styles.overlay}>
      <div ref={ref} className={styles.modal}>
        <h2 className={styles.title}>{title}</h2>
        {children}
      </div>
    </div>
  );
}

export { Modal };
