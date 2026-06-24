// src/components/DashboardSkeleton.jsx
import React from "react";
import SkeletonLoader from "./SkeletonLoader";

const SkeletonLoader = () => {
  return (
    <div className="container-fluid">
      {/* Welcome Card Skeleton */}
      <div className="row">
        <div className="col-12 col-lg-8 d-flex align-items-stretch">
          <div className="card w-100 bg-primary-subtle overflow-hidden shadow-none">
            <div className="card-body02 position-relative p-3">
              <div className="row">
                <div className="col-12 col-sm-7">
                  <div className="d-flex align-items-center mb-3">
                    <SkeletonLoader width="40px" height="40px" borderRadius="50%" />
                    <SkeletonLoader width="150px" height="24px" style={{ marginLeft: 12 }} />
                  </div>
                  <div className="row g-2 mt-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="col-4">
                        <div className="card01 border-0 shadow-sm p-2 text-center">
                          <SkeletonLoader width="60px" height="12px" style={{ margin: "0 auto" }} />
                          <SkeletonLoader width="50px" height="20px" style={{ margin: "4px auto 0" }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="row g-2 mt-2">
                    <div className="col-6">
                      <div className="countdown-box text-center p-2">
                        <SkeletonLoader width="60px" height="12px" style={{ margin: "0 auto" }} />
                        <SkeletonLoader width="80px" height="18px" style={{ margin: "4px auto 0" }} />
                      </div>
                    </div>
                    <div className="col-6">
                      <div className="countdown-box text-center p-2">
                        <SkeletonLoader width="40px" height="12px" style={{ margin: "0 auto" }} />
                        <SkeletonLoader width="60px" height="18px" style={{ margin: "4px auto 0" }} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-sm-5">
                  <SkeletonLoader width="100%" height="150px" borderRadius="12px" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Income Wallet Skeleton */}
        <div className="col-md-6 col-lg-4 d-flex align-items-stretch">
          <div className="card w-100">
            <div className="card-body p-3">
              <SkeletonLoader width="120px" height="20px" style={{ marginBottom: 16 }} />
              <div className="row g-2 align-items-center">
                <div className="col-5 col-sm-5 col-md-6">
                  <SkeletonLoader width="100%" height="100px" borderRadius="50%" />
                </div>
                <div className="col-7 col-sm-7 col-md-6">
                  {[1, 2, 3, 4, 5].map(i => (
                    <div key={i} className="d-flex align-items-center justify-content-between mb-2">
                      <SkeletonLoader width="60px" height="10px" />
                      <SkeletonLoader width="40px" height="10px" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bot Income Cards Skeleton */}
      <div className="row mt-3">
        <div className="col-12 col-lg-8">
          <div className="row g-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="col-6 col-lg-4 d-flex align-items-stretch">
                <div className="card01 w-100 border-0 shadow-sm p-3">
                  <SkeletonLoader width="80px" height="12px" />
                  <SkeletonLoader width="60px" height="24px" style={{ marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>
          <div className="row g-2 mt-2">
            {[1, 2, 3].map(i => (
              <div key={i} className="col-6 col-lg-4 d-flex align-items-stretch">
                <div className="card w-100 border-0 shadow-sm p-3">
                  <SkeletonLoader width="80px" height="12px" />
                  <SkeletonLoader width="60px" height="24px" style={{ marginTop: 4 }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* APEX Token Skeleton */}
        <div className="col-lg-4">
          <div className="card w-100">
            <div className="card-body02 p-3">
              <div className="d-flex justify-content-between align-items-center">
                <SkeletonLoader width="100px" height="24px" />
                <SkeletonLoader width="60px" height="20px" />
              </div>
              <SkeletonLoader width="100%" height="65px" style={{ marginTop: 12 }} />
              <div className="mt-2">
                <SkeletonLoader width="80px" height="28px" />
                <SkeletonLoader width="100px" height="14px" style={{ marginTop: 4 }} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apex Mining Program Skeleton */}
      <hr className="mb-2 mt-4" />
      <SkeletonLoader width="200px" height="28px" style={{ marginBottom: 16 }} />

      <div className="container-fluid">
        <div className="row g-3">
          <div className="col-12 col-lg-8">
            <div className="row g-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="col-6 col-md-4 col-lg-4 d-flex align-items-stretch">
                  <div className="card02 w-100 border-0 shadow-sm p-3">
                    <SkeletonLoader width="100px" height="16px" />
                    <SkeletonLoader width="60px" height="24px" style={{ marginTop: 8 }} />
                    <SkeletonLoader width="80px" height="16px" style={{ marginTop: 8 }} />
                    <SkeletonLoader width="50px" height="20px" style={{ marginTop: 4 }} />
                  </div>
                </div>
              ))}
            </div>
            <div className="row g-2 mt-2">
              {[1, 2].map(i => (
                <div key={i} className="col-12 col-md-6 d-flex align-items-stretch">
                  <div className="card02 w-100 border-0 shadow-sm p-3">
                    <SkeletonLoader width="120px" height="16px" />
                    <SkeletonLoader width="60px" height="24px" style={{ marginTop: 8 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Team Details Skeleton */}
          <div className="col-12 col-lg-4 d-flex align-items-stretch">
            <div className="card02 w-100 border-0 shadow-sm p-3">
              <SkeletonLoader width="150px" height="20px" style={{ marginBottom: 16 }} />
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="d-flex align-items-center justify-content-between mb-2">
                  <SkeletonLoader width="100px" height="14px" />
                  <SkeletonLoader width="40px" height="14px" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payout Cards Skeleton */}
      <hr className="mb-2 mt-4" />
      <SkeletonLoader width="150px" height="28px" style={{ marginBottom: 16 }} />

      <div className="row">
        {[1, 2, 3].map(i => (
          <div key={i} className="col-12 col-lg-4 d-flex align-items-stretch">
            <div className="card w-100 border-0 p-3">
              <SkeletonLoader width="120px" height="20px" />
              <div className="payout-input-box p-3 mt-2">
                <SkeletonLoader width="100%" height="40px" />
                <div className="d-flex align-items-center justify-content-between mt-4">
                  <div>
                    <SkeletonLoader width="60px" height="20px" />
                    <SkeletonLoader width="80px" height="12px" style={{ marginTop: 4 }} />
                  </div>
                  <SkeletonLoader width="80px" height="36px" borderRadius="8px" />
                </div>
                <SkeletonLoader width="150px" height="14px" style={{ marginTop: 12 }} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkeletonLoader;