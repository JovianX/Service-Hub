from pydantic import BaseModel
from pydantic import Field
from pydantic import HttpUrl
from pydantic import constr


class HelmRepositorySchema(BaseModel):
    name: constr(min_length=3, strip_whitespace=True) = Field(description='Repository name.')
    url: HttpUrl = Field(description='Repository URL.')
