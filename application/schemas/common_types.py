from pydantic import constr


# RFC 1123 compliant string.
K8sSubdomainNameString = constr(regex=r'[a-z0-9]([-a-z0-9]*[a-z0-9])?', max_length=253)
