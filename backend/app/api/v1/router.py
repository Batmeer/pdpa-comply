from fastapi import APIRouter
from .assessments import router as assessments_router
from .catalogue import router as catalogue_router
from .demos import router as demos_router

router = APIRouter(prefix="/v1")
router.include_router(assessments_router, prefix="/assessments", tags=["assessments"])
router.include_router(catalogue_router, prefix="/catalogue", tags=["catalogue"])
router.include_router(demos_router, prefix="/demos", tags=["demos"])
