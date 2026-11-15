"""
Strict Pydantic schemas for Cricket Domain MCP Tools & Analytics.
"""
from typing import Optional, List
from pydantic import BaseModel, Field


class PlayerStatsQueryInput(BaseModel):
    player_name: str = Field(..., description="Canonical or partial player name (e.g. 'Kohli', 'Bumrah').")
    role: str = Field("all", description="Player role filter: 'bat', 'bowl', or 'all'.")
    competition_filter: Optional[str] = Field(None, description="Optional filter by competition: 'IPL', 'T20I', or specific year.")


class PressureStatsQueryInput(BaseModel):
    player_name: str = Field(..., description="Canonical or partial player name.")
    role: str = Field("bat", description="'bat' for batting metrics or 'bowl' for bowling metrics.")
    leverage_threshold: float = Field(0.65, ge=0.0, le=1.0, description="Pressure Leverage threshold (default 0.65).")


class TopRankingsInput(BaseModel):
    role: str = Field(..., description="'bat' for Top 10 Batters or 'bowl' for Top 10 Bowlers.")
    min_balls: int = Field(50, ge=10, description="Minimum balls faced/bowled in high-pressure scenarios.")
    limit: int = Field(10, ge=1, le=50, description="Number of ranked players to return (default 10).")


class PlayerStatsOutput(BaseModel):
    player_id: int
    player_name: str
    matches_played: int
    balls: int
    runs: int
    wickets: int
    strike_rate: Optional[float]
    economy_rate: Optional[float]
    dot_ball_pct: float
    boundary_pct: float


class PressureStatsOutput(BaseModel):
    player_id: int
    player_name: str
    role: str
    pressure_balls: int
    pressure_runs: int
    pressure_wickets: int
    baseline_metric: float
    pressure_metric: float
    clutch_differential: float
    resilience_score: float


class MatchSummaryOutput(BaseModel):
    match_id: int
    comp_name: str
    match_date: str
    venue: str
    home_team: str
    away_team: str
    winner: str
    result: str
    is_knockout: bool
