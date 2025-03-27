interface DocsDescriptionProps {
  title: string;
  subTitle: string;
  description: string;
}

export const DocsDescription = ({
  title,
  subTitle,
  description,
}: DocsDescriptionProps) => {
  return (
    <div className="flex flex-col gap-x-2">
      <p className="text-info-small">{title}</p>
      <div className="text-md text-text-description">
        <span className="font-bold">{subTitle}</span>
        <span className="font-normal">{description}</span>
      </div>
    </div>
  );
};
