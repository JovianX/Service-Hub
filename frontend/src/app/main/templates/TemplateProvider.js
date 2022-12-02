import yaml from 'js-yaml';
import YAML from 'json-to-pretty-yaml';
import { createContext, useCallback, useMemo, useState } from 'react';

export const TemplateContext = createContext({ templateBuilder: null, configYamlText: '' });

export const TemplateProvider = ({ children }) => {
  const [templateBuilder, setTemplateBuilder] = useState(null);

  const onChangeYaml = useCallback((newValue) => {
    try {
      setTemplateBuilder(yaml.load(newValue, { json: true }));
    } catch (e) {
      console.log(e);
    }
  }, []);

  const configYamlText = useMemo(() => {
    if (!templateBuilder) return '';
    return YAML.stringify(templateBuilder);
  }, [templateBuilder]);

  const value = useMemo(
    () => ({ templateBuilder, setTemplateBuilder, configYamlText, onChangeYaml }),
    [templateBuilder, configYamlText],
  );

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
};
