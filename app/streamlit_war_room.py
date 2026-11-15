"""
app/streamlit_war_room.py
Interactive Rajasthan Royals Pressure War Room Dashboard (v5)
"""
import streamlit as st
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from pathlib import Path

st.set_page_config(page_title="SupeRR Selector S2: Pressure War Room v5", layout="wide")

PROC_DIR = Path("data/processed")

@st.cache_data
def load_rankings():
    bat = pd.read_parquet(PROC_DIR / "batter_clustered_rankings.parquet")
    bowl = pd.read_parquet(PROC_DIR / "bowler_clustered_rankings.parquet")
    top10_bat = pd.read_csv(PROC_DIR / "unstop_top10_batters_under_pressure.csv")
    top10_bowl = pd.read_csv(PROC_DIR / "unstop_top10_bowlers_under_pressure.csv")
    return bat, bowl, top10_bat, top10_bowl

st.markdown(
    """
    <div style="background:linear-gradient(90deg, #0B132B 0%, #254AA5 50%, #EA1A85 100%);
                padding:20px;border-radius:12px;color:white;margin-bottom:20px;">
        <h1 style="margin:0;color:white;">👑 Rajasthan Royals — SupeRR Selector Season 2 War Room (v5)</h1>
        <p style="margin:5px 0 0 0;font-size:1.1rem;">
            Multi-Regime Pressure Taxonomy, 13 Granular Micro-Execution Parameters & Scale-Matched LBMO Stress-Tested Rankings
        </p>
    </div>
    """,
    unsafe_allow_html=True,
)

if (PROC_DIR / "batter_clustered_rankings.parquet").exists():
    bat_df, bowl_df, top10_bat, top10_bowl = load_rankings()

    tab1, tab2, tab3, tab4 = st.tabs([
        "🏆 Unstop Top 10 & Micro-Skill Evidence",
        "📈 Baseline vs. Pressure Elevation Quadrant",
        "🔥 3-Regime Pressure Taxonomy (Crisis / Escalation / Crunch)",
        "🎯 8-Axis Micro-Execution Radar & Pro-Comps",
    ])

    with tab1:
        col1, col2 = st.columns(2)
        with col1:
            st.subheader("🔥 Top 10 Batters Under Pressure")
            st.dataframe(
                top10_bat[[
                    "unstop_rank", "player_name", "press_balls", "press_innings_count",
                    "eb_press_tsr", "eb_press_wpa_100", "eb_vs_elite_press_raaa_pb",
                    "eb_counterpunch_raaa_pb", "eb_lbmo_raaa_pb", "top10_retention_pct",
                    "pressure_reliability_score"
                ]].round(2),
                use_container_width=True,
                hide_index=True,
            )
        with col2:
            st.subheader("⚡ Top 10 Bowlers Under Pressure")
            st.dataframe(
                top10_bowl[[
                    "unstop_rank", "player_name", "press_balls", "press_Overs_matches",
                    "eb_press_tecon", "eb_press_wpa_100", "eb_vs_elite_press_waaa_pb",
                    "eb_blowup_avoid_pct", "eb_stump_attack_pct", "eb_lbmo_waaa_pb",
                    "top10_retention_pct", "pressure_reliability_score"
                ]].round(2),
                use_container_width=True,
                hide_index=True,
            )

    with tab2:
        st.subheader("Baseline Performance vs. High-Pressure Performance (Who Rises When It Matters?)")
        role_choice = st.radio("Select Category:", ["Batters", "Bowlers"], horizontal=True)
        if role_choice == "Batters":
            fig = px.scatter(
                bat_df,
                x="eb_base_raaa_pb",
                y="eb_press_raaa_pb",
                size="press_balls",
                color="pressure_reliability_score",
                hover_name="player_name",
                hover_data=["pro_comp_player", "eb_vs_elite_press_raaa_pb", "top10_retention_pct"],
                color_continuous_scale=["#0B132B", "#254AA5", "#EA1A85", "#FFD700"],
                labels={
                    "eb_base_raaa_pb": "Usual Baseline RAAA / Ball (Ordinary Situations)",
                    "eb_press_raaa_pb": "High-Pressure RAAA / Ball (EB-Stabilized)",
                },
                title="Batter Clutch Elevation Quadrant (Above Diagonal = Pressure Risers)",
            )
            fig.add_shape(type="line", x0=-0.3, y0=-0.3, x1=0.5, y1=0.5, line=dict(color="white", dash="dash"))
            st.plotly_chart(fig, use_container_width=True)
        else:
            fig = px.scatter(
                bowl_df,
                x="eb_base_waaa_pb",
                y="eb_press_waaa_pb",
                size="press_balls",
                color="pressure_reliability_score",
                hover_name="player_name",
                hover_data=["pro_comp_player", "eb_blowup_avoid_pct", "top10_retention_pct"],
                color_continuous_scale=["#0B132B", "#254AA5", "#EA1A85", "#FFD700"],
                labels={
                    "eb_base_waaa_pb": "Usual Baseline WAAA / Ball (Ordinary Situations)",
                    "eb_press_waaa_pb": "High-Pressure WAAA / Ball (EB-Stabilized)",
                },
                title="Bowler Clutch Elevation Quadrant (Above Diagonal = Pressure Risers)",
            )
            fig.add_shape(type="line", x0=-0.3, y0=-0.3, x1=0.5, y1=0.5, line=dict(color="white", dash="dash"))
            st.plotly_chart(fig, use_container_width=True)

    with tab3:
        st.subheader("Multi-Regime Pressure Taxonomy Breakdown (Crisis Arrest vs. Rate Escalation vs. Knife-Edge Crunch)")
        c1, c2 = st.columns(2)
        with c1:
            st.dataframe(
                top10_bat[[
                    "unstop_rank", "player_name", "eb_crisis_raaa_pb",
                    "eb_escalation_raaa_pb", "eb_crunch_raaa_pb", "eb_chase_press_raaa_pb"
                ]].round(3),
                use_container_width=True,
                hide_index=True,
            )
        with c2:
            st.dataframe(
                top10_bowl[[
                    "unstop_rank", "player_name", "eb_crisis_waaa_pb",
                    "eb_escalation_waaa_pb", "eb_crunch_waaa_pb", "eb_defend_press_waaa_pb"
                ]].round(3),
                use_container_width=True,
                hide_index=True,
            )

    with tab4:
        selected_bat = st.selectbox("Select Batter for 8-Axis Micro-Execution Radar:", bat_df["player_name"].tolist())
        row = bat_df[bat_df["player_name"] == selected_bat].iloc[0]
        categories = [
            "Pressure RAAA", "Clutch WPA/100", "vs Elite Bowlers", "Counter-Punch",
            "First-6 Intent", "Strike Rotation", "LBMO Resilience", "Match Consistency"
        ]
        values = [
            float(row["s_raaa"]),
            float(row["s_wpa"]),
            float(bat_df["eb_vs_elite_press_raaa_pb"].rank(pct=True).loc[row.name] * 100),
            float(bat_df["eb_counterpunch_raaa_pb"].rank(pct=True).loc[row.name] * 100),
            float(bat_df["eb_f6_press_raaa_pb"].rank(pct=True).loc[row.name] * 100),
            float(bat_df["eb_press_rotation_pct"].rank(pct=True).loc[row.name] * 100),
            float(bat_df["eb_lbmo_raaa_pb"].rank(pct=True).loc[row.name] * 100),
            float(row["consistency_score"]),
        ]
        radar = go.Figure(
            data=go.Scatterpolar(r=values + [values[0]], theta=categories + [categories[0]], fill="toself", line_color="#EA1A85")
        )
        radar.update_layout(
            polar=dict(radialaxis=dict(visible=True, range=[0, 100])),
            title=f"{selected_bat} — Closest Pro-Comp: {row['pro_comp_player']} (Top-10 Stability: {row['top10_retention_pct']:.1f}%)",
        )
        st.plotly_chart(radar, use_container_width=True)
else:
    st.info("Run the pipeline scripts (01 through 07) to populate `data/processed/` before launching the dashboard.")
