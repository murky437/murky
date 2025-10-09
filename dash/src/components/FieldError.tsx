import styles from './FieldError.module.css';

interface Props {
  fieldErrors?: string[];
}

function FieldError({ fieldErrors }: Props) {
  if (!fieldErrors || fieldErrors.length === 0) return null;
  return (
    <>
      {fieldErrors.map((err, idx) => (
        <div key={idx} className={styles.inputError}>
          {err}
        </div>
      ))}
    </>
  );
}

export { FieldError };
