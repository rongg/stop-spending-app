import React from 'react';
import '../../styles/home.css';
import PiggyBank from "../common/piggy_bank";

function StopSpendingHome() {
    return <div className={'homepage page'}>
        <section className={'splash text-center'}>
            <div className={'container'}>
                <div className={'row'}>
                    <div className={'col-12'}>
                        <PiggyBank width={275} height={175}/>
                        <h4 style={{marginTop: '10px', marginBottom: '16px'}}>A habit-based personal expense logger.</h4>
                        <button className="btn btn-primary" onClick={() => {
                        }}>Register
                        </button>
                    </div>
                </div>
            </div>
        </section>
        <section className={'explain'}>
            <div className={'container'}>
                <p>
                    Stop Spending is a simple web application that allows anyone who wishes to keep a personal log of their
                    daily expenses and view them over time. Log expenses, identify habits, set goals, and STOP SPENDING!
                </p>
            </div>
        </section>
        <section className={'features'}>
            <div className={'container'}>
                <h2 className={'text-center'}>How to Stop Spending</h2>
                <br/>
                <br/>
                <br/>
                <div className={'feature'}>
                    <div className={'row'}>
                        <div className={'col-4'}>
                            <h5>#1) Log Your Expenses Manually</h5>
                            <p>Many expense tracking apps automate much of the expense logging process thru integrations with your
                                personal accounts such as bank, credit card, etc., thereby fighting the battle for you.</p>
                            <p>The Stop Spending App doesn't need to know about any of these.</p>
                            <p>Take ownership of your expenses by keeping an honest and accurate log of your wallet. It is half the battle!</p>
                        </div>
                        <div className={'col-8 screen'}>
                            <div className={'card'}>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-6'}>
                                            <img alt={'not found!'}
                                                 src={require('../../assets/screens/summary_stats.png')}/>
                                        </div>
                                        <div className={'col-6'}>
                                            <img alt={'not found!'} src={require('../../assets/screens/week.png')}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div className={'feature'}>
                    <div className={'row'}>
                        <div className={'col-4'}>
                            <h5>#2) Name Your Spending Habits</h5>
                            <p>That $3 coffee in the morning is much more expensive than you think. So put a label on it!</p>
                            <p>Select an icon for your spending habit and name it. Habit names can be as general or specific as
                                you like.</p>
                            <p> Some examples: </p>
                            <ul>
                                <li>Morning Coffee</li>
                                <li>Lunch M-F</li>
                                <li>Cigarettes</li>
                                <li>Beer with Steve</li>
                                <li>Weekend Eating</li>
                                <li>Streaming Service Subscriptions</li>
                            </ul>
                            <p>
                                What, where, or when are you spending? What is most important is what it means to you.
                            </p>
                        </div>

                        <div className={'col-8 screen'}>
                            <div className={'card'}>
                                <div className={'card-body'}>
                                    <img alt={'not found!'} src={require('../../assets/screens/my_habit.png')}/>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div className={'feature'}>
                    <div className={'row'}>
                        <div className={'col-4'}>
                            <h5>#3) Set Budgets and Keep Logging</h5>
                            <p>
                                Once you have identified your personal spending habits, it is time to log expenses accordingly.
                            </p>
                            <p>
                                Set monthly, weekly, or daily budgets. Assign need/want to expenses and log urges to spend.
                            </p>
                        </div>

                        <div className={'col-8 screen'}>
                            <div className={'card'}>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-5'}>
                                            <img alt={'not found!'}
                                                 src={require('../../assets/screens/stats_close.png')}/>
                                        </div>
                                        <div className={'col-7'}>
                                            <img alt={'not found!'}
                                                 src={require('../../assets/screens/calendar.png')}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br/>
                <div className={'feature'}>
                    <div className={'row'}>
                        <div className={'col-4'}>
                            <h5>#4) Set Goals -- Micro-Budget, Abstain, Beat</h5>
                            <p>
                                Is someone's birthday coming up? Or any event that will inevitably cause you to spend more
                                than you would like on your habit? Want to stop spending completely?
                            </p>
                            <p>Set a goal to get over the hump!</p>
                            <p>
                                Create temporary budgets, collect days of abstaining from spending completely,
                                or attempt to beat the previous week's expenses. Name your goal!
                            </p>
                        </div>

                        <div className={'col-8 screen'}>
                            <div className={'card'}>
                                <div className={'card-body'}>
                                    <div className={'row'}>
                                        <div className={'col-6'}>
                                            <img alt={'not found!'}
                                                 src={require('../../assets/screens/fuel_level.png')}/>
                                        </div>
                                        <div className={'col-6'}>
                                            <img alt={'not found!'}
                                                 src={require('../../assets/screens/abstain_month.png')}/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>;
}

export default StopSpendingHome;