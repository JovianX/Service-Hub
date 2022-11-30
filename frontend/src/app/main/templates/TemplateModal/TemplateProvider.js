import { createContext, useState } from 'react';

const TemplateContext = createContext({ templateBuilder: null });

export const TemplateProvider = ({ children }) => {
  const [templateBuilder, setTemplateBuilder] = useState(null);

  return (
    <TemplateContext.Provider value={{ templateBuilder, setTemplateBuilder }}>{children}</TemplateContext.Provider>
  );
};
