import styles from './GeneralErrors.module.css';

interface Props {
  errors: string[];
}

function GeneralErrors({ errors }: Props) {
  return (
    errors.length > 0 && (
      <div className={styles.generalErrors}>
        {errors.map((error, idx) => (
          <div key={idx} className={styles.errorText}>
            {error}
          </div>
        ))}
      </div>
    )
  );
}

export { GeneralErrors };
