import streamlit as st
import streamlit.components.v1 as components

# ==============================================================================
# CIVICS PLUS — PRODUCTION EMBED RUNNER (100% REACT UI PARITY)
# ==============================================================================
st.set_page_config(
    page_title="Civics Plus — Civic Intelligence",
    page_icon="🇮🇳",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# Remove all Streamlit padding, toolbar, and borders
st.markdown(
    """
    <style>
    /* Full reset for Streamlit container */
    #MainMenu, header[data-testid="stHeader"], footer { 
        display: none !important; 
        visibility: hidden !important; 
    }
    .block-container, [data-testid="stMainBlockContainer"] { 
        padding: 0 !important; 
        margin: 0 !important; 
        max-width: 100% !important; 
    }
    iframe { 
        width: 100vw !important; 
        height: 100vh !important; 
        border: none !important; 
        display: block !important; 
    }
    body, [data-testid="stAppViewContainer"] {
        background: #060B14 !important;
        overflow: hidden !important;
    }
    </style>
    """,
    unsafe_allow_html=True,
)

# Live React App URL (Google Cloud Production Build with Full Animations)
REACT_APP_URL = "https://ais-pre-hzjtr4lelkqhysiiggbl6w-707916364379.asia-southeast1.run.app"

components.iframe(
    REACT_APP_URL,
    height=980,
    scrolling=True,
)
