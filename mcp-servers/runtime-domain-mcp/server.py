"""
Standard Model Context Protocol (MCP) stdio server for Cricket Pressure Domain.
Exposes tools for player query, high-pressure analysis, and ranking retrieval.
"""
import sys
import json
import logging
from typing import Dict, Any

# Local analytics imports
import os
sys.path.append(os.path.dirname(__file__))
from analytics_engine import get_player_stats, get_top_pressure_players, load_datasets

logging.basicConfig(level=logging.INFO, stream=sys.stderr)
logger = logging.getLogger("cricket-domain-mcp")

TOOLS = [
    {
        "name": "query_player_stats",
        "description": "Retrieves comprehensive career baseline stats for a cricketer (runs, strike rate, economy, dot %, boundary %).",
        "inputSchema": {
            "type": "object",
            "properties": {
                "player_name": {
                    "type": "string",
                    "description": "Canonical or partial player name (e.g., 'Kohli', 'Bumrah', 'Russell')."
                },
                "role": {
                    "type": "string",
                    "enum": ["all", "bat", "bowl"],
                    "default": "all",
                    "description": "Filter by role."
                }
            },
            "required": ["player_name"]
        }
    },
    {
        "name": "get_top_pressure_players",
        "description": "Computes and returns the top-ranked players performing under high-pressure conditions with clutch differential scores.",
        "inputSchema": {
            "type": "object",
            "properties": {
                "role": {
                    "type": "string",
                    "enum": ["bat", "bowl"],
                    "description": "'bat' for top batters, 'bowl' for top bowlers."
                },
                "min_balls": {
                    "type": "integer",
                    "default": 60,
                    "description": "Minimum balls faced or bowled in high-pressure match situations."
                },
                "limit": {
                    "type": "integer",
                    "default": 10,
                    "description": "Number of top players to return (default 10)."
                }
            },
            "required": ["role"]
        }
    },
    {
        "name": "get_dataset_summary",
        "description": "Returns counts and metadata for all available datasets (matches, balls, competitions, players).",
        "inputSchema": {
            "type": "object",
            "properties": {}
        }
    }
]


def handle_request(req: Dict[str, Any]) -> Dict[str, Any]:
    method = req.get("method")
    req_id = req.get("id")

    if method == "initialize":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "protocolVersion": "2024-11-05",
                "capabilities": {
                    "tools": {}
                },
                "serverInfo": {
                    "name": "cricket-domain-mcp",
                    "version": "1.0.0"
                }
            }
        }
    elif method == "tools/list":
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {
                "tools": TOOLS
            }
        }
    elif method == "tools/call":
        params = req.get("params", {})
        tool_name = params.get("name")
        args = params.get("arguments", {})

        try:
            if tool_name == "query_player_stats":
                data = get_player_stats(args.get("player_name"), args.get("role", "all"))
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [{"type": "text", "text": json.dumps(data, default=str)}]
                    }
                }
            elif tool_name == "get_top_pressure_players":
                data = get_top_pressure_players(
                    role=args.get("role", "bat"),
                    min_balls=args.get("min_balls", 60),
                    limit=args.get("limit", 10)
                )
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [{"type": "text", "text": json.dumps(data, default=str)}]
                    }
                }
            elif tool_name == "get_dataset_summary":
                data = load_datasets()
                summary = {
                    "matches_count": len(data["matches"]),
                    "deliveries_count": len(data["bbb"]),
                    "competitions_count": len(data["competitions"]),
                    "unique_players_mapped": len(data["players"])
                }
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "result": {
                        "content": [{"type": "text", "text": json.dumps(summary)}]
                    }
                }
            else:
                return {
                    "jsonrpc": "2.0",
                    "id": req_id,
                    "error": {"code": -32601, "message": f"Method {tool_name} not found"}
                }
        except Exception as e:
            return {
                "jsonrpc": "2.0",
                "id": req_id,
                "error": {"code": -32000, "message": str(e)}
            }
    else:
        return {
            "jsonrpc": "2.0",
            "id": req_id,
            "result": {}
        }


def main():
    logger.info("Starting Cricket Domain MCP stdio server...")
    while True:
        line = sys.stdin.readline()
        if not line:
            break
        try:
            req = json.loads(line)
            res = handle_request(req)
            sys.stdout.write(json.dumps(res) + "\n")
            sys.stdout.flush()
        except Exception as e:
            logger.error(f"Error handling request: {e}")


if __name__ == "__main__":
    main()
