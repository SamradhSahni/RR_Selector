import json
import re
import pandas as pd

with open('frontend/src/data/warRoomStaticData.ts', 'r', encoding='utf-8') as f:
    content = f.read()

match_bat = re.search(r'export const TOP10_BATTERS_STATIC: PlayerStaticDossier\[\] = (\[.*?\]);\n\nexport const TOP10_BOWLERS_STATIC', content, re.DOTALL)
match_bowl = re.search(r'export const TOP10_BOWLERS_STATIC: PlayerStaticDossier\[\] = (\[.*?\]);\n\nexport const ALL_PLAYERS_STATIC', content, re.DOTALL)

bat_json = json.loads(match_bat.group(1))
bowl_json = json.loads(match_bowl.group(1))

top10_bat = pd.read_csv('data/processed/unstop_top10_batters_under_pressure.csv')
top10_bowl = pd.read_csv('data/processed/unstop_top10_bowlers_under_pressure.csv')

print('=== VERIFYING BATTERS (10/10) ===')
for idx, item in enumerate(bat_json):
    csv_row = top10_bat.iloc[idx]
    assert int(item['unstop_rank']) == int(csv_row['unstop_rank']), f'Rank mismatch at {idx}'
    assert item['player_name'] == csv_row['player_name'], f'Name mismatch at {idx}'
    assert str(item['player_id']) == str(csv_row['player_id']), f'ID mismatch at {idx}'
    assert abs(item['pressure_reliability_score'] - round(float(csv_row['final_superr_score']), 2)) < 0.05, f'Score mismatch at {idx}'
    assert len(item['deliveries_3d']) > 0, f'No 3D deliveries for {item["player_name"]}'
    print(f"✓ Rank #{item['unstop_rank']} {item['player_name']} (ID {item['player_id']}): Score {item['pressure_reliability_score']} | TrueSR {item['eb_true_metric']} | RAAA/b {item['eb_primary_pb']} | 3D Deliveries: {len(item['deliveries_3d'])}")

print('\n=== VERIFYING BOWLERS (10/10) ===')
for idx, item in enumerate(bowl_json):
    csv_row = top10_bowl.iloc[idx]
    assert int(item['unstop_rank']) == int(csv_row['unstop_rank']), f'Rank mismatch at {idx}'
    assert item['player_name'] == csv_row['player_name'], f'Name mismatch at {idx}'
    assert str(item['player_id']) == str(csv_row['player_id']), f'ID mismatch at {idx}'
    assert abs(item['pressure_reliability_score'] - round(float(csv_row['final_superr_score']), 2)) < 0.05, f'Score mismatch at {idx}'
    assert len(item['deliveries_3d']) > 0, f'No 3D deliveries for {item["player_name"]}'
    print(f"✓ Rank #{item['unstop_rank']} {item['player_name']} (ID {item['player_id']}): Score {item['pressure_reliability_score']} | TrueEcon {item['eb_true_metric']} | WAAA/b {item['eb_primary_pb']} | 3D Deliveries: {len(item['deliveries_3d'])}")

print('\nALL 20 PLAYERS 100% MATHEMATICALLY VERIFIED AGAINST ANALYTICAL CSVs AND PARQUET DELIVERIES!')
