import yaml from 'js-yaml';
import YAML from 'json-to-pretty-yaml';
import { createContext, useCallback, useMemo, useState } from 'react';

export const TemplateContext = createContext({
  templateBuilder: null,
  configYamlText: '',
  infoIsYamlValid: '',
  inputDescription: '',
});

export const TemplateProvider = ({ children }) => {
  const [templateBuilder, setTemplateBuilder] = useState(null);
  const [infoIsYamlValid, setInfoIsYamlValid] = useState('');
  const [inputDescription, setInputDescription] = useState('');

  const onChangeInputDescription = useCallback((newValue) => {
    setInputDescription(newValue);
  }, []);

  const onChangeYaml = useCallback((newValue) => {
    try {
      setTemplateBuilder(yaml.load(newValue, { json: true }));
      setInfoIsYamlValid('');
    } catch (e) {
      setInfoIsYamlValid(e.reason);
    }
  }, []);

  const configYamlText = useMemo(() => {
    if (!templateBuilder) return '';
    return YAML.stringify(templateBuilder);
  }, [templateBuilder]);

  const value = useMemo(
    () => ({
      templateBuilder,
      setTemplateBuilder,
      configYamlText,
      onChangeYaml,
      infoIsYamlValid,
      inputDescription,
      onChangeInputDescription,
    }),
    [templateBuilder, configYamlText, infoIsYamlValid],
  );

  return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
};
