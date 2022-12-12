"""
Template Output schema.
"""
from pydantic import BaseModel
from pydantic import Extra
from pydantic import Field


class Output(BaseModel):
    """
    Outputs for Application consumer.
    """
    notes: str = Field(description='Message for Application consumer.', example='We hope you enjoy it.')

    class Config:
        extra = Extra.forbid
